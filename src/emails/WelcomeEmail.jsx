import {
  Html,
  Head,
  Body,
  Container,
  Section,
  Heading,
  Text,
  Button,
  Hr,
  Link,
  Preview,
} from "@react-email/components";

export const WelcomeEmail = ({
  userFirstname = "Utilisateur",
}) => {
  return (
    <Html>
      <Head>
        <style>{`
          @media only screen and (max-width: 600px) {
            .container {
              width: 100% !important;
              padding-left: 20px !important;
              padding-right: 20px !important;
            }
            .h1 {
              font-size: 20px !important;
              text-align: center !important;
            }
            .text {
              font-size: 15px !important;
              text-align: center !important;
            }
            .button {
              width: 100% !important;
              box-sizing: border-box !important;
            }
          }
          @media (prefers-color-scheme: dark) {
            .body { background-color: #000000 !important; }
            .container { background-color: #000000 !important; }
            .h1 { color: #ffffff !important; }
            .text { color: #D1D5DC !important; }
            .hr { border-color: #252525 !important; }
            .footer-text { color: #94a3b8 !important; }
          }
        `}</style>
      </Head>
      <Preview>Bienvenue sur Klipp - Votre expérience commence ici</Preview>
      <Body className="body" style={main}>
        <Container className="container" style={container}>
          <Section style={logoContainer}>
            <Heading style={logoText}>KLIPP</Heading>
          </Section>
          
          <Heading className="h1" style={h1}>
            Bienvenue, {userFirstname} !
          </Heading>
          
          <Text className="text" style={text}>
            Nous sommes ravis de vous compter parmi nous. Klipp a été conçu pour
            vous offrir une expérience fluide et performante.
          </Text>
          
          <Section style={btnContainer}>
            <Button className="button" style={button} href="https://klipp.app/dashboard">
              Commencer l'aventure
            </Button>
          </Section>
          
          <Text className="text" style={text}>
            Si vous avez des questions, n'hésitez pas à répondre à cet email.
            Notre équipe est là pour vous aider.
          </Text>
          
          <Hr className="hr" style={hr} />
          
          <Section style={footer}>
            <Text className="footer-text" style={footerText}>
              Klipp © 2026. Tous droits réservés.
            </Text>
            <Link href="https://klipp.app" style={footerLink}>
              Visitez notre site
            </Link>
          </Section>
        </Container>
      </Body>
    </Html>
  );
};

export default WelcomeEmail;

const main = {
  backgroundColor: "#f8f9fb",
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen-Sans,Ubuntu,Cantarell,"Helvetica Neue",sans-serif',
  padding: "20px 0",
};

const container = {
  backgroundColor: "#f8f9fb",
  margin: "0 auto",
  padding: "20px 40px 48px",
  width: "580px",
  maxWidth: "100%",
  borderRadius: "12px",
};

const logoContainer = {
  padding: "32px 0",
  textAlign: "center",
};

const logoText = {
  color: "#2B7FFF",
  fontSize: "32px",
  fontWeight: "bold",
  letterSpacing: "4px",
  margin: "0",
};

const h1 = {
  color: "#0f172a",
  fontSize: "24px",
  fontWeight: "600",
  lineHeight: "1.2",
  margin: "0 0 24px",
  textAlign: "left",
};

const text = {
  color: "#64748b",
  fontSize: "16px",
  lineHeight: "24px",
  textAlign: "left",
  margin: "0 0 16px",
};

const btnContainer = {
  textAlign: "center",
  margin: "32px 0",
};

const button = {
  backgroundColor: "#2B7FFF",
  borderRadius: "12px",
  color: "#ffffff",
  fontSize: "16px",
  fontWeight: "bold",
  textDecoration: "none",
  textAlign: "center",
  display: "inline-block",
  padding: "12px 30px",
};

const hr = {
  borderColor: "#e2e8f0",
  margin: "42px 0 26px",
};

const footer = {
  textAlign: "center",
};

const footerText = {
  color: "#94a3b8",
  fontSize: "14px",
  margin: "0 0 10px",
};

const footerLink = {
  color: "#2B7FFF",
  textDecoration: "underline",
  fontSize: "14px",
};
