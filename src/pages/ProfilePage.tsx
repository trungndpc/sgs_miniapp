import React from 'react';
import { Page } from 'zmp-ui';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { navigateForward } from '@/utils/navigation';
import { PATHS } from '@/constants/paths';

const ProfilePage: React.FC = () => {
  const { user, isMember, loading } = useAuth();
  const navigate = useNavigate();

  return (
    <Page className="bg-sgs-bg min-h-screen pb-24">
      <div className="px-5 pt-6">
        <p className="font-display text-[11px] font-bold tracking-[0.22em] text-sgs-gray uppercase">
          Account
        </p>
        <h1 className="mt-1 font-display text-[28px] font-extrabold tracking-tight text-sgs-black">
          Cá nhân
        </h1>

        {loading && <p className="mt-8 text-sm text-sgs-gray">Đang tải...</p>}

        {!loading && (
          <div className="mt-8">
            <div className="flex items-end gap-4 border-b border-sgs-border pb-6">
              <div className="h-20 w-20 overflow-hidden bg-sgs-black">
                {user?.avatar_url ? (
                  <img src={user.avatar_url} alt="" className="h-full w-full object-cover" />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-sgs-orange font-display text-2xl font-bold text-white">
                    {(user?.full_name || user?.display_name || 'S').charAt(0)}
                  </div>
                )}
              </div>
              <div className="pb-1">
                <p className="font-display text-[22px] font-bold leading-tight text-sgs-black">
                  {user?.full_name || user?.display_name || 'Khách'}
                </p>
                <p className="mt-1 font-display text-[12px] font-semibold tracking-[0.12em] uppercase text-sgs-gray">
                  {isMember ? 'Thành viên SGS Academy' : 'Chưa đăng ký'}
                </p>
              </div>
            </div>

            {!isMember && (
              <div className="mt-6">
                <p className="max-w-sm text-[14px] leading-relaxed text-sgs-gray">
                  Đăng ký thành viên để xem tin nội bộ và đăng ký lớp đào tạo của SGS Academy.
                </p>
                <button
                  type="button"
                  className="mt-5 bg-sgs-orange px-5 py-3 font-display text-[13px] font-bold tracking-wide text-white"
                  onClick={() => navigateForward(navigate, PATHS.REGISTER)}
                >
                  Đăng ký thành viên
                </button>
              </div>
            )}

            {user && (
              <dl className="mt-6 divide-y divide-sgs-border border-t border-sgs-border">
                {[
                  ['Số điện thoại', user.phone || '—'],
                  ['Email', user.email || '—'],
                  ['Địa chỉ', [user.ward, user.city].filter(Boolean).join(', ') || '—'],
                ].map(([label, value]) => (
                  <div key={label} className="flex justify-between gap-4 py-4">
                    <dt className="text-[12px] tracking-wide text-sgs-gray uppercase">{label}</dt>
                    <dd className="text-right text-[14px] font-medium text-sgs-black">{value}</dd>
                  </div>
                ))}
              </dl>
            )}

            {isMember && (
              <button
                type="button"
                className="mt-6 w-full border border-sgs-black py-3 font-display text-[13px] font-bold tracking-wide text-sgs-black"
                onClick={() => navigateForward(navigate, PATHS.MY_REGISTRATIONS)}
              >
                Lớp đã đăng ký
              </button>
            )}
          </div>
        )}
      </div>
    </Page>
  );
};

export default ProfilePage;
