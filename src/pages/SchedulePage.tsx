import React, { useMemo, useState } from 'react';
import { Page } from 'zmp-ui';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { navigateForward } from '@/utils/navigation';
import { contentService } from '@/services/content';
import DaySelector from '@/components/DaySelector';

type Mode = 'day' | 'course';

const SchedulePage: React.FC = () => {
  const navigate = useNavigate();
  const [mode, setMode] = useState<Mode>('day');
  const [selectedDate, setSelectedDate] = useState(() => new Date());
  const dateKey = useMemo(() => selectedDate.toISOString().slice(0, 10), [selectedDate]);

  const { data: sessions = [], isLoading: loadingSessions } = useQuery({
    queryKey: ['sessions', dateKey],
    queryFn: () => contentService.listSessions({ date: dateKey }),
    enabled: mode === 'day',
  });
  const { data: courses = [], isLoading: loadingCourses } = useQuery({
    queryKey: ['courses'],
    queryFn: () => contentService.listCourses(),
    enabled: mode === 'course',
  });

  return (
    <Page className="bg-sgs-bg min-h-screen pb-24">
      <div className="px-5 pt-6">
        <p className="font-display text-[11px] font-bold tracking-[0.22em] text-sgs-gray uppercase">
          Training
        </p>
        <h1 className="mt-1 font-display text-[28px] font-extrabold tracking-tight text-sgs-black">
          Lịch đào tạo
        </h1>

        <div className="mt-5 flex border border-sgs-border bg-sgs-white">
          {(
            [
              { key: 'day', label: 'Theo ngày' },
              { key: 'course', label: 'Theo khóa' },
            ] as const
          ).map((item) => (
            <button
              key={item.key}
              type="button"
              className={`flex-1 py-2.5 font-display text-[13px] font-semibold ${
                mode === item.key ? 'bg-sgs-orange text-white' : 'text-sgs-gray'
              }`}
              onClick={() => setMode(item.key)}
            >
              {item.label}
            </button>
          ))}
        </div>

        {mode === 'day' && (
          <>
            <div className="mt-5">
              <DaySelector value={selectedDate} onChange={setSelectedDate} />
            </div>
            <div className="mt-6 divide-y divide-sgs-border border-t border-sgs-border">
              {loadingSessions && <p className="py-4 text-sm text-sgs-gray">Đang tải...</p>}
              {sessions.map((session) => (
                <button
                  key={session.id}
                  type="button"
                  className="flex w-full gap-4 py-4 text-left"
                  onClick={() => navigateForward(navigate, `/courses/${session.course_id}`)}
                >
                  <div className="w-14 shrink-0">
                    <p className="font-display text-[20px] font-bold leading-none text-sgs-black">
                      {new Date(session.starts_at).toLocaleTimeString('vi-VN', {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </p>
                    <p className="mt-1 text-[11px] text-sgs-gray">
                      {new Date(session.ends_at).toLocaleTimeString('vi-VN', {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </p>
                  </div>
                  <div className="min-w-0 flex-1 border-l border-sgs-orange pl-4">
                    <p className="font-display text-[15px] font-semibold leading-snug text-sgs-black">
                      {session.course?.title ?? `Khóa #${session.course_id}`}
                    </p>
                    <p className="mt-1 text-[12px] text-sgs-gray">
                      {session.course?.location_text ||
                        session.course?.online_url ||
                        session.status}
                    </p>
                  </div>
                </button>
              ))}
              {!loadingSessions && sessions.length === 0 && (
                <p className="py-6 text-sm text-sgs-gray">Không có buổi học trong ngày này.</p>
              )}
            </div>
          </>
        )}

        {mode === 'course' && (
          <div className="mt-6 divide-y divide-sgs-border border-t border-sgs-border">
            {loadingCourses && <p className="py-4 text-sm text-sgs-gray">Đang tải...</p>}
            {courses.map((course) => (
              <button
                key={course.id}
                type="button"
                className="w-full py-5 text-left"
                onClick={() => navigateForward(navigate, `/courses/${course.id}`)}
              >
                <p className="font-display text-[11px] font-bold tracking-[0.14em] text-sgs-gray uppercase">
                  {course.location_type}
                </p>
                <p className="mt-1 font-display text-[17px] font-bold leading-snug text-sgs-black">
                  {course.title}
                </p>
                <p className="mt-2 line-clamp-2 text-[13px] leading-relaxed text-sgs-gray">
                  {course.description}
                </p>
                <p className="mt-2 text-[12px] text-sgs-black/70">
                  {course.location_text || course.online_url || '—'}
                </p>
              </button>
            ))}
            {!loadingCourses && courses.length === 0 && (
              <p className="py-6 text-sm text-sgs-gray">Chưa có khóa học.</p>
            )}
          </div>
        )}
      </div>
    </Page>
  );
};

export default SchedulePage;
