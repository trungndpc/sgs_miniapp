import React from 'react';
import { Page, useSnackbar } from 'zmp-ui';
import { useNavigate, useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { contentService } from '@/services/content';
import { useAuth } from '@/context/AuthContext';
import { navigateForward } from '@/utils/navigation';
import { PATHS } from '@/constants/paths';

const NewsDetailPage: React.FC = () => {
  const { id } = useParams();
  const articleId = Number(id);
  const navigate = useNavigate();
  const { openSnackbar } = useSnackbar();
  const { isMember } = useAuth();
  const { data, error, isLoading } = useQuery({
    queryKey: ['article', articleId],
    queryFn: () => contentService.getArticle(articleId),
    enabled: articleId > 0,
    retry: false,
  });

  React.useEffect(() => {
    if (!error) return;
    const msg = (error as { response?: { data?: { error?: { code?: string } } } })?.response?.data
      ?.error?.code;
    if (msg === 'MEMBER_REQUIRED') {
      openSnackbar({ text: 'Nội dung dành cho thành viên', type: 'error' });
      navigateForward(navigate, PATHS.REGISTER);
    }
  }, [error, navigate, openSnackbar]);

  return (
    <Page className="bg-sgs-white min-h-screen pb-10">
      <div className="px-5 pt-4">
        <button
          type="button"
          className="font-display text-[12px] font-semibold tracking-wide text-sgs-gray"
          onClick={() => navigate(-1)}
        >
          ← Quay lại
        </button>

        {isLoading && <p className="mt-8 text-sm text-sgs-gray">Đang tải...</p>}

        {data && (
          <article className="mt-5">
            {data.cover_url && (
              <div className="-mx-5 aspect-[16/10] overflow-hidden bg-sgs-black">
                <img src={data.cover_url} alt="" className="h-full w-full object-cover" />
              </div>
            )}
            <p className="mt-5 font-display text-[11px] font-bold tracking-[0.16em] text-sgs-gray uppercase">
              {data.visibility === 'member' ? 'Thành viên' : 'Insights'}
              {!isMember && data.visibility === 'member' ? ' · cần đăng ký' : ''}
            </p>
            <h1 className="mt-2 font-display text-[28px] leading-tight font-extrabold tracking-tight text-sgs-black">
              {data.title}
            </h1>
            <div className="mt-2 h-1 w-12 bg-sgs-orange" />
            <div
              className="sgs-prose mt-6 text-[15px]"
              dangerouslySetInnerHTML={{ __html: data.body || '<p>Không có nội dung.</p>' }}
            />
          </article>
        )}
      </div>
    </Page>
  );
};

export default NewsDetailPage;
