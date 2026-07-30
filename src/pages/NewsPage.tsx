import React, { useState } from 'react';
import { Page } from 'zmp-ui';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { navigateForward } from '@/utils/navigation';
import { contentService } from '@/services/content';

const NewsPage: React.FC = () => {
  const navigate = useNavigate();
  const [categoryId, setCategoryId] = useState<number | undefined>();
  const { data: categories = [] } = useQuery({
    queryKey: ['categories'],
    queryFn: () => contentService.listCategories(),
  });
  const { data: articles = [], isLoading } = useQuery({
    queryKey: ['articles', categoryId],
    queryFn: () => contentService.listArticles(categoryId ? { category_id: categoryId } : undefined),
  });

  const lead = articles[0];
  const rest = articles.slice(1);

  return (
    <Page className="bg-sgs-bg min-h-screen pb-24">
      <div className="px-5 pt-6">
        <p className="font-display text-[11px] font-bold tracking-[0.22em] text-sgs-gray uppercase">
          Insights
        </p>
        <h1 className="mt-1 font-display text-[28px] font-extrabold tracking-tight text-sgs-black">
          Tin tức
        </h1>

        <div className="mt-5 flex gap-2 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <button
            type="button"
            className={`shrink-0 border px-3 py-1.5 font-display text-[12px] font-semibold tracking-wide ${
              !categoryId
                ? 'border-sgs-black bg-sgs-black text-white'
                : 'border-sgs-border bg-transparent text-sgs-black'
            }`}
            onClick={() => setCategoryId(undefined)}
          >
            Tất cả
          </button>
          {categories.map((c) => (
            <button
              key={c.id}
              type="button"
              className={`shrink-0 border px-3 py-1.5 font-display text-[12px] font-semibold tracking-wide ${
                categoryId === c.id
                  ? 'border-sgs-black bg-sgs-black text-white'
                  : 'border-sgs-border bg-transparent text-sgs-black'
              }`}
              onClick={() => setCategoryId(c.id)}
            >
              {c.name}
            </button>
          ))}
        </div>

        {isLoading && <p className="mt-8 text-sm text-sgs-gray">Đang tải...</p>}

        {!isLoading && lead && (
          <button
            type="button"
            className="mt-6 w-full text-left"
            onClick={() => navigateForward(navigate, `/news/${lead.id}`)}
          >
            <div className="aspect-[16/10] overflow-hidden bg-sgs-black/5">
              {lead.cover_url ? (
                <img src={lead.cover_url} alt="" className="h-full w-full object-cover" />
              ) : null}
            </div>
            <p className="mt-3 font-display text-[11px] font-bold tracking-[0.14em] text-sgs-gray uppercase">
              {lead.visibility === 'member' ? 'Thành viên' : 'Công khai'}
              {lead.published_at
                ? ` · ${new Date(lead.published_at).toLocaleDateString('vi-VN')}`
                : ''}
            </p>
            <h2 className="mt-1 font-display text-[22px] leading-snug font-bold text-sgs-black">
              {lead.title}
            </h2>
          </button>
        )}

        <div className="mt-2 divide-y divide-sgs-border border-t border-sgs-border">
          {rest.map((article) => (
            <button
              key={article.id}
              type="button"
              className="flex w-full gap-4 py-4 text-left"
              onClick={() => navigateForward(navigate, `/news/${article.id}`)}
            >
              <div className="h-[4.5rem] w-[4.5rem] shrink-0 overflow-hidden bg-sgs-black/5">
                {article.cover_url ? (
                  <img src={article.cover_url} alt="" className="h-full w-full object-cover" />
                ) : null}
              </div>
              <div className="min-w-0 flex-1 self-center">
                <p className="font-display text-[11px] font-bold tracking-[0.12em] text-sgs-gray uppercase">
                  {article.visibility === 'member' ? 'Thành viên' : 'Công khai'}
                </p>
                <p className="mt-1 line-clamp-2 font-display text-[15px] leading-snug font-semibold text-sgs-black">
                  {article.title}
                </p>
              </div>
            </button>
          ))}
        </div>

        {!isLoading && articles.length === 0 && (
          <p className="mt-8 text-sm text-sgs-gray">Chưa có tin tức.</p>
        )}
      </div>
    </Page>
  );
};

export default NewsPage;
