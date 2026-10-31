import { siteConfig } from '@/config/site-config';
import '@/styles/blogPost.css';
import PageHero from '@/components/PageHero';

export const metadata = {
  title: 'Integritetspolicy',
  description:
    'Så hanterar Ahlgrens Husbilar dina personuppgifter: vilka uppgifter vi samlar in, hur vi använder dem och hur länge vi sparar dem.',
  alternates: { canonical: '/integritetspolicy' },
};

export default function IntegritetspolicyPage() {
  const { email } = siteConfig.contact;

  return (
    <>
        <PageHero
        eyebrow="INTEGRITETSPOLICY"
        title="Din integritet är viktig för oss"
        subtitle="Här förklarar vi på ett enkelt sätt vilka uppgifter vi samlar in när du besöker vår webbplats, varför vi gör det och hur länge vi sparar dem."
        />
        <div className="blog-post">
        <div className="container">
            <h1 className="blog-post__title">Integritetspolicy</h1>
            <p className="blog-post__meta">Senast uppdaterad: 31 oktober 2026</p>

            <div className="blog-post__content">
                <p>
                Din integritet är viktig för oss. Här förklarar vi på ett enkelt sätt vilka uppgifter
                vi samlar in när du besöker vår webbplats, varför vi gör det och hur länge vi sparar
                dem. Vi samlar bara in det som behövs för att webbplatsen ska fungera, och vi säljer
                aldrig dina uppgifter till tredje part.
                </p>

                <h2>Information vi samlar in</h2>

                <h3>Meddelanden och e-post</h3>
                <p>
                När du kontaktar oss eller skickar en förfrågan kan vi ta emot din e-postadress och de
                uppgifter du själv skriver i meddelandet, till exempel ditt namn och vilken bil du är
                intresserad av. Vi använder uppgifterna för att svara dig och hjälpa dig med din
                förfrågan.
                </p>

                <h3>Ungefärlig plats</h3>
                <p>
                Vi kan uppskatta var du befinner dig i stora drag med hjälp av Googles tjänster, för
                att göra din upplevelse på webbplatsen bättre. Vi följer inte din exakta position och
                använder inte GPS-koordinater i realtid.
                </p>

                <h2>Så använder vi dina uppgifter</h2>
                <ul>
                <li>För att svara på dina frågor, förfrågningar och meddelanden.</li>
                <li>
                    För att visa innehåll som är relevant för dig, till exempel avstånd eller
                    vägbeskrivning till oss.
                </li>
                <li>För att hålla webbplatsen fungerande, säker och användbar.</li>
                </ul>
                <p>
                Vi säljer inte dina personuppgifter och använder dem inte för något annat ändamål än
                de som beskrivs här.
                </p>

                <h2>Cookies</h2>
                <p>
                Vi använder funktionella cookies och lagring i webbläsaren som behövs för att
                webbplatsen ska fungera, bland annat för att komma ihåg dina val om cookies. Dessa kan
                inte stängas av. Övriga cookies, som cookies från Google Maps, används bara om du
                godkänner dem. Du kan när som helst ändra ditt val via &quot;Cookieinställningar&quot;
                längst ned på sidan.
                </p>

                <h2>Delning av uppgifter</h2>
                <p>
                Vi delar inte dina uppgifter med andra, förutom med tjänsteleverantörer som behövs för
                att webbplatsen ska fungera. Ett exempel är Google, som hjälper oss att visa karta och
                vägbeskrivning och att uppskatta din ungefärliga plats. Dessa leverantörer får bara
                använda uppgifterna för att leverera sin tjänst till oss.
                </p>

                <h3>Vägbeskrivning med Google Maps</h3>
                <p>
                För att hjälpa dig hitta till vårt kontor använder vi en karta och vägbeskrivning från
                Google Maps, en tjänst från tredje part. Kartan hämtas från Google först när du har
                godkänt cookies från tredje part. Google får då din IP-adress och teknisk information
                om din webbläsare och kan lagra cookies. Vi får inte del av dessa uppgifter och sparar
                dem inte. Googles hantering av uppgifter beskrivs i{' '}
                <a
                    href="https://policies.google.com/privacy"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    Googles integritetspolicy
                </a>
                .
                </p>

                <h2>Lagring och radering</h2>
                <p>
                Vi sparar inte din e-postadress när ett meddelande eller en förfrågan är avslutad. När
                samtalet är klart finns uppgifterna inte kvar hos oss. Ungefärlig platsinformation
                används under ditt besök för att förbättra upplevelsen och sparas inte som en profil
                över dig.
                </p>

                <h2>Skydd av dina uppgifter</h2>
                <p>
                Genom att samla in så lite som möjligt minskar vi risken för att något går fel. Vi
                vidtar rimliga tekniska och organisatoriska åtgärder för att skydda de uppgifter vi
                hanterar mot obehörig åtkomst, förlust och missbruk.
                </p>

                <h2>Dina rättigheter</h2>
                <p>Enligt dataskyddsförordningen (GDPR) har du rätt att:</p>
                <ul>
                <li>få veta vilka personuppgifter vi har om dig,</li>
                <li>begära att felaktiga uppgifter rättas,</li>
                <li>begära att dina uppgifter raderas,</li>
                <li>invända mot att vi behandlar dina uppgifter,</li>
                <li>
                    lämna klagomål till Integritetsskyddsmyndigheten (IMY) om du anser att vi hanterar
                    dina uppgifter fel.
                </li>
                </ul>

                <h2>Ändringar i policyn</h2>
                <p>
                Vi kan uppdatera den här policyn när det behövs. Den senaste versionen finns alltid på
                den här sidan, och datumet högst upp visar när den ändrades senast.
                </p>

                <h2>Kontakta oss</h2>
                <p>
                Har du frågor om hur vi hanterar dina uppgifter, eller vill du använda någon av dina
                rättigheter? Hör av dig till oss på <a href={`mailto:${email}`}>{email}</a>.
                </p>
            </div>
            
        </div>
        </div>
    </>
  );
}