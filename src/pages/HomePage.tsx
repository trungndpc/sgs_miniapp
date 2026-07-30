import React from 'react';
import { Page, useSnackbar } from 'zmp-ui';
import { configAppView } from 'zmp-sdk';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { navigateForward } from '@/utils/navigation';
import { PATHS } from '@/constants/paths';
import { contentService } from '@/services/content';
import { useAuth } from '@/context/AuthContext';
import { isZaloRuntime } from '@/lib/runtime';
import logoSgs from '@/assets/logo-sgs.png';

const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const { openSnackbar } = useSnackbar();
  const { isMember } = useAuth();
  const { data: pinned = [] } = useQuery({
    queryKey: ['articles', 'pinned'],
    queryFn: () => contentService.listArticles({ pinned: true }),
  });
  const { data: sessions = [] } = useQuery({
    queryKey: ['sessions', 'upcoming'],
    queryFn: () => contentService.listSessions(),
  });

  React.useEffect(() => {
    if (!isZaloRuntime) return;
    configAppView({
      headerColor: '#111111',
      headerTextColor: 'white',
      actionBar: { hide: true },
    }).catch(() => {});
  }, []);

  const featured = pinned[0];
  const morePinned = pinned.slice(1, 3);
  const upcoming = sessions.slice(0, 3);

  const goRegister = () => {
    if (isMember) {
      openSnackbar({ text: 'Bạn đã là thành viên', type: 'success' });
      navigateForward(navigate, PATHS.PROFILE);
      return;
    }
    navigateForward(navigate, PATHS.REGISTER);
  };

  return (
    <Page className="bg-sgs-bg relative min-h-screen pb-24">
      {/* Compact hero for mini-app viewport */}
      <section className="relative overflow-hidden bg-sgs-black text-white">
        <div
          className="hero-zoom absolute inset-0 opacity-40"
          style={{
            backgroundImage:
              'url(https://images.unsplash.com/photo-1581093588401-fbb62a02f120?w=1200&q=70)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-black/35" />

        <div className="relative z-10 px-5 py-5">
          <h1 className="anim-fade-up font-display text-[22px] leading-tight font-extrabold tracking-tight">
            Academy Vietnam
          </h1>
          <p className="anim-fade-up-delay mt-1.5 max-w-[20rem] text-[13px] leading-snug text-white/75">
            Đào tạo tiêu chuẩn quốc tế cho chuyên gia Việt Nam.
          </p>

          <div className="anim-fade-up-delay-2 mt-4 flex items-center gap-2">
            <button
              type="button"
              onClick={goRegister}
              className="bg-sgs-orange px-3.5 py-2 font-display text-[12px] font-bold tracking-wide text-white"
            >
              Đăng ký
            </button>
            <button
              type="button"
              onClick={() => navigateForward(navigate, PATHS.SCHEDULE)}
              className="border border-white/35 px-3.5 py-2 font-display text-[12px] font-semibold tracking-wide text-white"
            >
              Lịch đào tạo
            </button>
          </div>
        </div>
      </section>

      {/* Shortcut strip — not cards */}
      <nav className="flex border-b border-sgs-border bg-sgs-white">
        {[
          { label: 'Tin tức', path: PATHS.NEWS },
          { label: 'Lịch học', path: PATHS.SCHEDULE },
          { label: 'Hồ sơ', path: PATHS.PROFILE },
        ].map((item, i) => (
          <button
            key={item.label}
            type="button"
            className={`flex-1 py-3.5 font-display text-[12px] font-semibold tracking-[0.08em] uppercase text-sgs-black ${
              i < 2 ? 'border-r border-sgs-border' : ''
            }`}
            onClick={() => navigateForward(navigate, item.path)}
          >
            {item.label}
          </button>
        ))}
      </nav>

      {/* Featured editorial */}
      <section className="px-5 pt-8">
        <div className="mb-4 flex items-end justify-between">
          <h2 className="font-display text-[22px] font-extrabold tracking-tight text-sgs-black">
            Nổi bật
          </h2>
          <button
            type="button"
            className="text-[12px] font-medium tracking-wide text-sgs-gray"
            onClick={() => navigateForward(navigate, PATHS.NEWS)}
          >
            Tất cả tin →
          </button>
        </div>

        {featured ? (
          <button
            type="button"
            className="w-full text-left"
            onClick={() => navigateForward(navigate, `/news/${featured.id}`)}
          >
            <div className="relative aspect-[16/10] overflow-hidden bg-sgs-black">
              {featured.cover_url ? (
                <img src={featured.cover_url} alt="" className="h-full w-full object-cover" />
              ) : (
                <div className="h-full w-full bg-sgs-orange/30" />
              )}
            </div>
            <p className="mt-3 font-display text-[11px] font-bold tracking-[0.16em] text-sgs-gray uppercase">
              {featured.visibility === 'member' ? 'Thành viên' : 'Insights'}
            </p>
            <h3 className="mt-1 font-display text-[20px] leading-snug font-bold text-sgs-black">
              {featured.title}
            </h3>
          </button>
        ) : (
          <p className="text-sm text-sgs-gray">Chưa có bài nổi bật.</p>
        )}

        <div className="mt-5 divide-y divide-sgs-border border-t border-sgs-border">
          {morePinned.map((article) => (
            <button
              key={article.id}
              type="button"
              className="flex w-full gap-3 py-4 text-left"
              onClick={() => navigateForward(navigate, `/news/${article.id}`)}
            >
              <div className="h-16 w-16 shrink-0 overflow-hidden bg-sgs-black/5">
                {article.cover_url ? (
                  <img src={article.cover_url} alt="" className="h-full w-full object-cover" />
                ) : null}
              </div>
              <div className="min-w-0 flex-1">
                <p className="font-display text-[15px] leading-snug font-semibold text-sgs-black">
                  {article.title}
                </p>
              </div>
            </button>
          ))}
        </div>
      </section>

      {/* Upcoming timeline */}
      <section className="mt-2 px-5 pt-6 pb-10">
        <div className="mb-4 flex items-end justify-between">
          <h2 className="font-display text-[22px] font-extrabold tracking-tight text-sgs-black">
            Sắp diễn ra
          </h2>
          <button
            type="button"
            className="text-[12px] font-medium tracking-wide text-sgs-gray"
            onClick={() => navigateForward(navigate, PATHS.SCHEDULE)}
          >
            Lịch đầy đủ →
          </button>
        </div>

        <div className="relative border-l border-sgs-border pl-4">
          {upcoming.length === 0 && (
            <p className="text-sm text-sgs-gray">Chưa có buổi học sắp tới.</p>
          )}
          {upcoming.map((session) => (
            <button
              key={session.id}
              type="button"
              className="relative mb-5 block w-full text-left last:mb-0"
              onClick={() => navigateForward(navigate, `/courses/${session.course_id}`)}
            >
              <span className="absolute -left-[21px] top-1.5 h-2.5 w-2.5 bg-sgs-orange" />
              <p className="font-display text-[11px] font-bold tracking-[0.12em] text-sgs-gray uppercase">
                {new Date(session.starts_at).toLocaleString('vi-VN', {
                  weekday: 'short',
                  day: '2-digit',
                  month: '2-digit',
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </p>
              <p className="mt-1 font-display text-[15px] font-semibold leading-snug text-sgs-black">
                {session.course?.title ?? `Khóa #${session.course_id}`}
              </p>
              <p className="mt-0.5 text-[12px] text-sgs-gray">
                {session.course?.location_text || session.course?.online_url || 'SGS Academy'}
              </p>
            </button>
          ))}
        </div>
      </section>
    </Page>
  );
};

export default HomePage;
