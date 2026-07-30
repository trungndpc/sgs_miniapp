import React from 'react';
import { Page } from 'zmp-ui';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { contentService } from '@/services/content';
import { navigateForward } from '@/utils/navigation';

const MyRegistrationsPage: React.FC = () => {
  const navigate = useNavigate();
  const { data = [], isLoading } = useQuery({
    queryKey: ['my-registrations'],
    queryFn: () => contentService.myRegistrations(),
  });

  return (
    <Page className="bg-sgs-bg min-h-screen pb-10">
      <div className="px-5 pt-4">
        <button
          type="button"
          className="font-display text-[12px] font-semibold tracking-wide text-sgs-gray"
          onClick={() => navigate(-1)}
        >
          ← Quay lại
        </button>
        <h1 className="mt-5 font-display text-[28px] font-extrabold tracking-tight text-sgs-black">
          Lớp đã đăng ký
        </h1>
        <div className="mt-2 h-1 w-12 bg-sgs-orange" />

        {isLoading && <p className="mt-8 text-sm text-sgs-gray">Đang tải...</p>}

        <div className="mt-6 divide-y divide-sgs-border border-t border-sgs-border">
          {data.map((item) => (
            <button
              key={item.id}
              type="button"
              className="w-full py-4 text-left"
              onClick={() => navigateForward(navigate, `/courses/${item.course_id}`)}
            >
              <p className="font-display text-[16px] font-semibold text-sgs-black">
                {item.course?.title ?? `Khóa #${item.course_id}`}
              </p>
              <p className="mt-1 text-[12px] uppercase tracking-wide text-sgs-gray">{item.status}</p>
            </button>
          ))}
          {!isLoading && data.length === 0 && (
            <p className="py-6 text-sm text-sgs-gray">Bạn chưa đăng ký lớp nào.</p>
          )}
        </div>
      </div>
    </Page>
  );
};

export default MyRegistrationsPage;
