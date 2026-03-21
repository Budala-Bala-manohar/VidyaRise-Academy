import './globals.css';
import { ThemeProvider } from './components/ThemeProvider';

export const metadata = {
  title: 'VidyaRise Academy - Empowering Education Through Innovation',
  description: 'VidyaRise Academy provides world-class education with innovative teaching methodologies, personalized learning paths, and comprehensive assessment systems.',
  keywords: 'education, academy, online learning, assessments, VidyaRise',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning>
        <ThemeProvider attribute="data-theme" defaultTheme="light" enableSystem>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
