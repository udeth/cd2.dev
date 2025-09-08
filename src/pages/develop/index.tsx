import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import { CONFIG } from 'src/global-config';


// ----------------------------------------------------------------------

const metadata = { title: `Develop - ${CONFIG.appName}` };

export default function Page() {
  return (
    <>
      <title>{metadata.title}</title>

      <Container>
        <Typography variant="h4">Develop</Typography>
      </Container>
    </>
  );
}
