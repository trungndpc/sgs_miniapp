import React, { useEffect } from 'react';
import { Input, Page, useSnackbar } from 'zmp-ui';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { loginWithZalo, registerMember } from '@/services/identity';
import { PATHS } from '@/constants/paths';
import { navigateForward } from '@/utils/navigation';

const RegisterPage: React.FC = () => {
  const { user, isMember, refresh, ensureLogin } = useAuth();
  const navigate = useNavigate();
  const { openSnackbar } = useSnackbar();
  const [fullName, setFullName] = React.useState('');
  const [phone, setPhone] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [avatarUrl, setAvatarUrl] = React.useState('');
  const [city, setCity] = React.useState('');
  const [ward, setWard] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const [prefetching, setPrefetching] = React.useState(true);

  useEffect(() => {
    if (isMember) {
      openSnackbar({ text: 'Bạn đã là thành viên', type: 'success' });
      navigateForward(navigate, PATHS.PROFILE);
    }
  }, [isMember, navigate, openSnackbar]);

  // Authorize + getUserInfo + getPhoneNumber → prefill form
  useEffect(() => {
    let cancelled = false;

    (async () => {
      setPrefetching(true);
      try {
        // withPhone: xin scope.userInfo + scope.userPhonenumber theo docs Zalo
        const result = await loginWithZalo({ withPhone: true });
        if (cancelled) return;
        const u = result.user;
        setFullName(u.full_name || u.display_name || '');
        setPhone(u.phone || '');
        setEmail(u.email || '');
        setAvatarUrl(u.avatar_url || '');
        setCity(u.city || '');
        setWard(u.ward || '');
        await refresh();
      } catch {
        if (cancelled) return;
        try {
          await ensureLogin();
        } catch {
          openSnackbar({
            text: 'Không lấy được thông tin Zalo. Bạn có thể nhập thủ công.',
            type: 'error',
          });
        }
      } finally {
        if (!cancelled) setPrefetching(false);
      }
    })();

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps -- run once on mount for Zalo permission UX
  }, []);

  useEffect(() => {
    if (!user || prefetching) return;
    if (!fullName) setFullName(user.full_name || user.display_name || '');
    if (!phone) setPhone(user.phone || '');
    if (!email) setEmail(user.email || '');
    if (!avatarUrl) setAvatarUrl(user.avatar_url || '');
    if (!city) setCity(user.city || '');
    if (!ward) setWard(user.ward || '');
  }, [user, prefetching, fullName, phone, email, avatarUrl, city, ward]);

  const onSubmit = async () => {
    if (!fullName || !phone || !email || !avatarUrl) {
      openSnackbar({ text: 'Vui lòng điền đủ họ tên, SĐT, email, ảnh', type: 'error' });
      return;
    }
    setLoading(true);
    try {
      await ensureLogin();
      await registerMember({
        full_name: fullName,
        phone,
        email,
        avatar_url: avatarUrl,
        city: city || undefined,
        ward: ward || undefined,
      });
      await refresh();
      openSnackbar({ text: 'Đăng ký thành viên thành công', type: 'success' });
      navigateForward(navigate, PATHS.PROFILE);
    } catch {
      openSnackbar({ text: 'Đăng ký thất bại', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

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

        <p className="mt-5 font-display text-[11px] font-bold tracking-[0.22em] text-sgs-gray uppercase">
          Membership
        </p>
        <h1 className="mt-1 font-display text-[28px] font-extrabold tracking-tight text-sgs-black">
          Đăng ký thành viên
        </h1>
        <p className="mt-2 max-w-sm text-[14px] leading-relaxed text-sgs-gray">
          Chúng tôi dùng quyền Zalo để điền sẵn họ tên, ảnh và số điện thoại — bạn chỉ cần bổ sung
          email (và địa chỉ nếu muốn).
        </p>
        <div className="mt-2 h-1 w-12 bg-sgs-orange" />

        {prefetching ? (
          <p className="mt-8 text-[14px] text-sgs-gray">Đang lấy thông tin từ Zalo…</p>
        ) : (
          <div className="mt-6 flex flex-col gap-3">
            <div className="flex items-center gap-3">
              {avatarUrl ? (
                <img
                  src={avatarUrl}
                  alt=""
                  className="h-14 w-14 object-cover bg-sgs-black"
                />
              ) : null}
              <p className="text-[12px] text-sgs-gray">
                Thông tin lấy từ Zalo (có thể chỉnh lại nếu cần).
              </p>
            </div>
            <Input label="Họ tên *" value={fullName} onChange={(e) => setFullName(e.target.value)} />
            <Input
              label="Số điện thoại *"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
            <Input
              label="Email *"
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Input
              label="Ảnh đại diện (URL) *"
              value={avatarUrl}
              onChange={(e) => setAvatarUrl(e.target.value)}
              placeholder="https://..."
            />
            <Input label="Tỉnh/Thành phố" value={city} onChange={(e) => setCity(e.target.value)} />
            <Input label="Phường/Xã" value={ward} onChange={(e) => setWard(e.target.value)} />
            <button
              type="button"
              disabled={loading}
              onClick={onSubmit}
              className="mt-2 w-full bg-sgs-orange py-3.5 font-display text-[13px] font-bold tracking-wide text-white disabled:opacity-60"
            >
              {loading ? 'Đang gửi...' : 'Hoàn tất đăng ký'}
            </button>
          </div>
        )}
      </div>
    </Page>
  );
};

export default RegisterPage;
