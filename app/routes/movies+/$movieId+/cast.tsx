import { useRef } from 'react';
import { Pagination } from '@nextui-org/pagination';
import { useMediaQuery } from '@react-hookz/web';
import { json, type LoaderFunctionArgs } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';
import { mergeMeta } from '~/utils';

import type { Handle } from '~/types/handle';
import type { loader as movieIdLoader } from '~/routes/movies+/$movieId';
import { authenticate } from '~/services/supabase';
import { getCredits } from '~/services/tmdb/tmdb.server';
import type { IMovieDetail } from '~/services/tmdb/tmdb.types';
import { postFetchDataHandler } from '~/services/tmdb/utils.server';
import TMDB from '~/utils/media';
import useSplitArrayIntoPage from '~/utils/react/hooks/useSplitArrayIntoPage';
import { CACHE_CONTROL } from '~/utils/server/http';
import MediaList from '~/components/media/MediaList';
import { BreadcrumbItem } from '~/components/elements/Breadcrumb';

export const loader = async ({ request, params }: LoaderFunctionArgs) => {
  await authenticate(request, undefined, true);

  const { movieId } = params;
  const mid = Number(movieId);

  if (!mid) throw new Response('Not found', { status: 404 });
  const credits = await getCredits('movie', mid);

  if (!credits) throw new Response('Not found', { status: 404 });

  return json(
    { cast: [...postFetchDataHandler(credits.cast, 'people')] },
    { headers: { 'Cache-Control': CACHE_CONTROL.detail } },
  );
};

export const meta = mergeMeta<typeof loader, { 'routes/movies+/$movieId': typeof movieIdLoader }>(
  ({ params, matches }) => {
    const movieData = matches.find((match) => match.id === 'routes/movies+/$movieId')?.data;
    if (!movieData) {
      return [
        { title: 'Missing Movie' },
        { name: 'description', content: `There is no movie with the ID: ${params.movieId}` },
      ];
    }
    const { detail } = movieData;
    const { title } = detail || {};
    const movieTitle = title || '';
    return [
      { title: `Sora - ${movieTitle} - Cast` },
      {
        property: 'og:url',
        content: `https://sorachill.vercel.app/movies/${params.movieId}/cast`,
      },
      { property: 'og:title', content: `Sora - ${movieTitle} - Cast` },
      { name: 'twitter:title', content: `Sora - ${movieTitle} - Cast` },
    ];
  },
);

export const handle: Handle = {
  breadcrumb: ({ match, t }) => (
    <BreadcrumbItem
      to={`/movies/${match.params.movieId}/cast`}
      key={`movies-${match.params.movieId}-cast`}
    >
      {t('cast')}
    </BreadcrumbItem>
  ),
  miniTitle: ({ parentMatch, t }) => ({
    title: parentMatch ? (parentMatch.data as { detail: IMovieDetail })?.detail?.title || '' : '',
    subtitle: t('cast'),
    showImage: parentMatch
      ? (parentMatch.data as { detail: IMovieDetail })?.detail?.poster_path !== undefined
      : false,
    imageUrl: parentMatch
      ? TMDB?.posterUrl(
          (parentMatch.data as { detail: IMovieDetail })?.detail?.poster_path || '',
          'w92',
        )
      : undefined,
  }),
};

const MovieCastPage = () => {
  const { cast } = useLoaderData<typeof loader>();
  const isSm = useMediaQuery('(max-width: 650px)', { initializeWithValue: false });
  const ref = useRef<HTMLDivElement>(null);
  const { gotoPage, currentPage, maxPage, currentData } = useSplitArrayIntoPage(cast || [], 20);

  return (
    <div className="mt-3 flex w-full max-w-screen-4xl flex-col gap-y-4 px-3 sm:px-3.5 xl:px-4 2xl:px-5">
      <div ref={ref} />
      <MediaList items={currentData} itemsType="people" listType="grid" />
      {maxPage > 1 ? (
        <div className="mt-7 flex flex-row justify-center">
          <Pagination
            // showControls={!isSm}
            total={maxPage}
            initialPage={currentPage}
            // shadow
            onChange={(page) => {
              gotoPage(page);
              ref.current?.scrollIntoView({
                behavior: 'instant',
                block: 'center',
                inline: 'nearest',
              });
            }}
            {...(isSm && { size: 'sm' })}
          />
        </div>
      ) : null}
    </div>
  );
};

export default MovieCastPage;
