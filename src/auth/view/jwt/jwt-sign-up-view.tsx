import { z as zod } from 'zod';
import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useBoolean } from 'minimal-shared/hooks';
import { zodResolver } from '@hookform/resolvers/zod';

import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';
import { RouterLink } from 'src/routes/components';

import { Iconify } from 'src/components/iconify';
import { Form, Field } from 'src/components/hook-form';

import { signUp, sendVerificationCode } from '../../context/jwt';
import { useAuthContext } from '../../hooks';
import { getErrorMessage } from '../../utils';
import { FormHead } from '../../components/form-head';
import { SignUpTerms } from '../../components/sign-up-terms';
import {SendVerificationCodeRequest, SignUpRequest} from "../../../types/api/auth";

// ----------------------------------------------------------------------

export type SignUpSchemaType = zod.infer<typeof SignUpSchema>;

export const SignUpSchema = zod.object({
  firstName: zod.string().min(1, { message: 'First name is required!' }),
  lastName: zod.string().min(1, { message: 'Last name is required!' }),
  email: zod
    .string()
    .min(1, { message: 'Email is required!' })
    .email({ message: 'Email must be a valid email address!' }),
  password: zod
    .string()
    .min(1, { message: 'Password is required!' })
    .min(6, { message: 'Password must be at least 6 characters!' }),
  verificationCode: zod
    .string()
    .min(1, { message: 'Verification code is required!' })
    .min(6, { message: 'Verification code must be 6 digits!' })
    .max(6, { message: 'Verification code must be 6 digits!' }),
});

// ----------------------------------------------------------------------

export function JwtSignUpView() {
  const router = useRouter();

  const showPassword = useBoolean();

  const { checkUserSession } = useAuthContext();

  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [sendingCode, setSendingCode] = useState(false);
  const [countdown, setCountdown] = useState(0);

  const defaultValues: SignUpSchemaType = {
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    verificationCode: '',
  };

  const methods = useForm<SignUpSchemaType>({
    resolver: zodResolver(SignUpSchema),
    defaultValues,
  });

  const {
    handleSubmit,
    watch,
    formState: { isSubmitting },
  } = methods;

  const emailValue = watch('email');

  // 倒计时逻辑
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (countdown > 0) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [countdown]);

  // 发送验证码
  const handleSendVerificationCode = async () => {
    if (!emailValue || sendingCode || countdown > 0) return;

    setSendingCode(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    try {
      const params: SendVerificationCodeRequest = { email: emailValue, scene: 'register' };
      await sendVerificationCode(params);

      setCountdown(60); // 60秒倒计时
      setSuccessMessage(`验证码已发送至 ${emailValue}，请查收邮件`);
    } catch (error) {
      console.error('Send verification code error:', error);
      const feedbackMessage = getErrorMessage(error);
      setErrorMessage(feedbackMessage);
    } finally {
      setSendingCode(false);
    }
  };

  const onSubmit = handleSubmit(async (data) => {
    try {
      setErrorMessage(null);
      setSuccessMessage(null);

      const params: SignUpRequest = { email: data.email, password: data.password, nickname: `${data.firstName} ${data.lastName}`, code: data.verificationCode };
      await signUp(params);
      await checkUserSession?.();

      router.refresh();
    } catch (error) {
      console.error(error);
      const feedbackMessage = getErrorMessage(error);
      setErrorMessage(feedbackMessage);
    }
  });

  const renderForm = () => (
    <Box sx={{ gap: 3, display: 'flex', flexDirection: 'column' }}>
      <Box
        sx={{ display: 'flex', gap: { xs: 3, sm: 2 }, flexDirection: { xs: 'column', sm: 'row' } }}
      >
        <Field.Text
          name="firstName"
          label="First name"
          placeholder="First name"
          slotProps={{ inputLabel: { shrink: true }, input: { placeholder: 'First name' } }}
        />
        <Field.Text
          name="lastName"
          label="Last name"
          placeholder="Last name"
          slotProps={{ inputLabel: { shrink: true }, input: { placeholder: 'Last name' } }}
        />
      </Box>

      <Field.Text
        name="email"
        label="Email address"
        placeholder="example@gmail.com"
        slotProps={{
          inputLabel: { shrink: true },
        }}
      />

      <Field.Text
        name="verificationCode"
        label="Verification code"
        placeholder="6-digit code"
        slotProps={{
          inputLabel: { shrink: true },
          input: {
            inputProps: {
              maxLength: 6,
              pattern: '[0-9]*',
              inputMode: 'numeric',
            },
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  size="small"
                  onClick={handleSendVerificationCode}
                  disabled={!emailValue || sendingCode || countdown > 0}
                  edge="end"
                  sx={{ 
                    fontSize: '0.75rem',
                    minWidth: 'auto',
                    transition: 'all 0.2s ease-in-out',
                    '&.Mui-disabled': {
                      color: 'text.disabled'
                    },
                    '&:hover:not(.Mui-disabled)': {
                      backgroundColor: 'action.hover',
                      transform: 'scale(1.05)'
                    }
                  }}
                >
                  {sendingCode ? (
                    <Box
                      sx={{
                        width: 16,
                        height: 16,
                        marginRight: '-6px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                        <Box
                          sx={{
                            width: 16,
                            height: 16,
                            border: '2px solid',
                            borderColor: 'text.secondary',
                            borderTopColor: 'transparent',
                            borderRadius: '50%',
                            animation: 'spin 0.8s linear infinite',
                            '@keyframes spin': {
                              '0%': { transform: 'rotate(0deg)' },
                              '100%': { transform: 'rotate(360deg)' }
                            }
                          }}
                        />
                    </Box>
                  ) : countdown > 0 ? (
                    countdown
                  ) : (
                        <Iconify icon="custom:send-fill" sx={{ marginRight: '-6px' }} />
                  )}
                </IconButton>
              </InputAdornment>
            ),
          },
        }}
      />

      <Field.Text
        name="password"
        label="Password"
        placeholder="8+ characters"
        type={showPassword.value ? 'text' : 'password'}
        slotProps={{
          inputLabel: { shrink: true },
          input: {
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={showPassword.onToggle} edge="end">
                  <Iconify icon={showPassword.value ? 'solar:eye-bold' : 'solar:eye-closed-bold'} />
                </IconButton>
              </InputAdornment>
            ),
          },
        }}
      />

      <Button
        fullWidth
        color="inherit"
        size="large"
        type="submit"
        variant="contained"
        loading={isSubmitting}
        loadingIndicator="Create account..."
      >
        Create account
      </Button>
    </Box>
  );

  return (
    <>
      <FormHead
        title="Get started absolutely free"
        description={
          <>
            {`Already have an account? `}
            <Link component={RouterLink} href={paths.auth.jwt.signIn} variant="subtitle2">
              Get started
            </Link>
          </>
        }
        sx={{ textAlign: { xs: 'center', md: 'left' } }}
      />

      {!!errorMessage && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {errorMessage}
        </Alert>
      )}

      <Form methods={methods} onSubmit={onSubmit}>
        {renderForm()}
      </Form>

      <SignUpTerms />
    </>
  );
}
