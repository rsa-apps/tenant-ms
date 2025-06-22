import {
  Body,
  Button,
  Container,
  Head,
  Html,
  Preview,
  Section,
  Text,
} from '@react-email/components'
import * as React from 'react'

interface ResetPasswordEmailProps {
  userFirstname?: string
  resetPasswordLink?: string
}

export const ResetPasswordEmail = ({
  userFirstname,
  resetPasswordLink,
}: ResetPasswordEmailProps) => {
  return (
    <Html>
      <Head />
      <Preview>Redefinição de senha</Preview>
      <Body style={main}>
        <Container style={container}>
          {/* <Img
            src={`${baseUrl}/static/dropbox-logo.png`}
            width="40"
            height="33"
            alt="Dropbox"
          /> */}
          <Section>
            <Text style={text}>OLá {userFirstname},</Text>
            <Text style={text}>
              Alguém recentemente solicitou uma alteração de senha para sua
              conta. Se foi você, pode definir uma nova senha aqui:
            </Text>
            <Button style={button} href={resetPasswordLink}>
              Redefinir senha
            </Button>
            <Text style={text}>
              Se você não deseja alterar sua senha ou não solicitou isso, apenas
              ignore e exclua esta mensagem.
            </Text>
            <Text style={text}>
              Para manter sua conta segura, por favor, não encaminhe este e-mail
              para ninguém.
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  )
}

export default ResetPasswordEmail

const main = {
  backgroundColor: '#f6f9fc',
  padding: '10px 0',
}

const container = {
  backgroundColor: '#ffffff',
  border: '1px solid #f0f0f0',
  padding: '45px',
}

const text = {
  fontSize: '16px',
  fontFamily:
    "'Open Sans', 'HelveticaNeue-Light', 'Helvetica Neue Light', 'Helvetica Neue', Helvetica, Arial, 'Lucida Grande', sans-serif",
  fontWeight: '300',
  color: '#404040',
  lineHeight: '26px',
}

const button = {
  backgroundColor: '#007ee6',
  borderRadius: '4px',
  color: '#fff',
  fontFamily: "'Open Sans', 'Helvetica Neue', Arial",
  fontSize: '15px',
  textDecoration: 'none',
  textAlign: 'center' as const,
  display: 'block',
  width: '210px',
  padding: '14px 7px',
}
