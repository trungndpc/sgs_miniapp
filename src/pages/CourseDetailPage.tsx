import React from 'react';
import { Page, useSnackbar } from 'zmp-ui';
import { useNavigate, useParams } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { contentService } from '@/services/content';
import { useAuth } from '@/context/AuthContext';
import { authStorage } from '@/lib/authStorage';
import { navigateForward } from '@/utils/navigation';
import { PATHS } from '@/constants/paths';

const CourseDetailPage: React.FC = () => {
  const { id } = useParams();
  const courseId = Number(id);
  const navigate = useNavigate();
  const { openSnackbar } = useSnackbar();
  const { ensureLogin } = useAuth();
  const queryClient = useQueryClient();
  const { data: course, isLoading } = useQuery({
    queryKey: ['course', courseId],
    queryFn: () => contentService.getCourse(courseId),
    enabled: courseId > 0,
  });

  const registerMutation = useMutation({
    mutationFn: async () => {
      await ensureLogin();
      if (!authStorage.getIsMember()) {
        throw new Error('MEMBER_REQUIRED');
      }
      return contentService.registerCourse(courseId);
    },
    onSuccess: () => {
      openSnackbar({ text: 'Đăng ký lớp thành công', type: 'success' });
      queryClient.invalidateQueries({ queryKey: ['my-registrations'] });
    },
    onError: (err: Error) => {
      if (err.message === 'MEMBER_REQUIRED') {
        openSnackbar({ text: 'Vui lòng đăng ký thành viên trước', type: 'error' });
        navigateForward(navigate, PATHS.REGISTER);
        return;
      }
      openSnackbar({ text: 'Không thể đăng ký lớp', type: 'error' });
    },
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

        {isLoading && <p className="mt-8 text-sm text-sgs-gray">Đang tải...</p>}

        {course && (
          <>
            <p className="mt-5 font-display text-[11px] font-bold tracking-[0.16em] text-sgs-gray uppercase">
              {course.location_type}
            </p>
            <h1 className="mt-1 font-display text-[28px] leading-tight font-extrabold tracking-tight text-sgs-black">
              {course.title}
            </h1>
            <div className="mt-2 h-1 w-12 bg-sgs-orange" />
            <p className="mt-5 whitespace-pre-wrap text-[14px] leading-relaxed text-sgs-gray">
              {course.description}
            </p>

            <dl className="mt-6 divide-y divide-sgs-border border-y border-sgs-border">
              <div className="flex justify-between gap-4 py-3.5">
                <dt className="text-[12px] uppercase tracking-wide text-sgs-gray">Địa điểm</dt>
                <dd className="max-w-[60%] text-right text-[13px] font-medium text-sgs-black">
                  {course.location_text || '—'}
                </dd>
              </div>
              <div className="flex justify-between gap-4 py-3.5">
                <dt className="text-[12px] uppercase tracking-wide text-sgs-gray">Online</dt>
                <dd className="max-w-[60%] truncate text-right text-[13px] font-medium text-sgs-black">
                  {course.online_url || '—'}
                </dd>
              </div>
            </dl>

            <h2 className="mt-8 font-display text-[18px] font-bold text-sgs-black">Các buổi học</h2>
            <div className="mt-3 divide-y divide-sgs-border border-t border-sgs-border">
              {(course.sessions ?? []).map((session) => (
                <div key={session.id} className="py-4">
                  <p className="font-display text-[14px] font-semibold text-sgs-black">
                    {new Date(session.starts_at).toLocaleString('vi-VN')} –{' '}
                    {new Date(session.ends_at).toLocaleTimeString('vi-VN', {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </p>
                  <p className="mt-1 text-[12px] uppercase tracking-wide text-sgs-gray">
                    {session.status}
                  </p>
                </div>
              ))}
              {(course.sessions ?? []).length === 0 && (
                <p className="py-4 text-sm text-sgs-gray">Chưa có buổi học.</p>
              )}
            </div>

            <button
              type="button"
              disabled={registerMutation.isPending}
              onClick={() => registerMutation.mutate()}
              className="mt-8 w-full bg-sgs-orange py-3.5 font-display text-[13px] font-bold tracking-wide text-white disabled:opacity-60"
            >
              {registerMutation.isPending ? 'Đang đăng ký...' : 'Đăng ký lớp'}
            </button>
          </>
        )}
      </div>
    </Page>
  );
};

export default CourseDetailPage;
