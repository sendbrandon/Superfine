/**
 * SUPERFINE · The Guest List — curated seed names
 *
 * 150+ historical and contemporary Black dandies whose tailoring,
 * style, and self-presentation made the case Monica L. Miller
 * argues in *Slaves to Fashion*: Black dandyism as resistance and
 * self-creation across the diaspora.
 *
 * Stored alphabetical (sorted at module load). User-paid additions
 * from Vercel KV are merged at render time and re-sorted, so the
 * final list always reads as one continuous alphabet.
 *
 * Editorial note: this list is the *floor*, not the ceiling.
 * Add, swap, prune as the curation deepens. Each name carries
 * its own dandyism story.
 */

const RAW_NAMES = [
  // 19th-century intellectuals + activists
  'Frederick Douglass',
  'Booker T. Washington',
  'W. E. B. Du Bois',
  'A. Philip Randolph',
  'Marcus Garvey',
  'Madame C. J. Walker',

  // Harlem Renaissance & early-20th-century
  'Langston Hughes',
  'Countee Cullen',
  'Zora Neale Hurston',
  'Claude McKay',
  'Jean Toomer',
  'Wallace Thurman',
  'Bruce Nugent',
  'Alain Locke',
  'Adam Clayton Powell Jr.',

  // Jazz era — the original suiting class
  'Duke Ellington',
  'Cab Calloway',
  'Count Basie',
  'Louis Armstrong',
  'Lester Young',
  'Dizzy Gillespie',
  'Charlie Parker',
  'Billy Eckstine',
  'Nat King Cole',
  'Sammy Davis Jr.',
  'Ella Fitzgerald',
  'Sarah Vaughan',
  'Lena Horne',
  'Josephine Baker',
  'Bessie Smith',
  'Billie Holiday',

  // Mid-century stage + screen
  'Sidney Poitier',
  'Harry Belafonte',
  'Ossie Davis',
  'Ruby Dee',
  'Dorothy Dandridge',
  'Eartha Kitt',
  'James Baldwin',
  'Lorraine Hansberry',
  'Maya Angelou',
  'Toni Morrison',
  'Ralph Ellison',
  'Gwendolyn Brooks',

  // Civil rights movement
  'Martin Luther King Jr.',
  'Coretta Scott King',
  'Malcolm X',
  'Stokely Carmichael',
  'Huey P. Newton',
  'Bobby Seale',
  'Angela Davis',
  'Fannie Lou Hamer',
  'Bayard Rustin',
  'Jesse Jackson',
  'Shirley Chisholm',
  'Ella Baker',

  // Soul + R&B style
  'Sam Cooke',
  'Otis Redding',
  'Marvin Gaye',
  'Curtis Mayfield',
  'Bill Withers',
  'Donny Hathaway',
  'Roberta Flack',
  'Aretha Franklin',
  'Diana Ross',
  'Stevie Wonder',
  'Smokey Robinson',
  'Teddy Pendergrass',
  'Lou Rawls',
  'Al Green',
  'Isaac Hayes',
  'Barry White',

  // Funk + dandy excess
  'James Brown',
  'Sly Stone',
  'George Clinton',
  'Bootsy Collins',
  'Rick James',
  'Prince',
  'Lenny Kravitz',
  'D\u2019Angelo',
  'Maxwell',
  'Erykah Badu',
  'Lauryn Hill',
  'Solange Knowles',
  'Janelle Mon\u00e1e',
  'Beyonc\u00e9 Knowles-Carter',

  // Hip-hop + streetwear architects
  'Russell Simmons',
  'Sean "Diddy" Combs',
  'Kanye West',
  'Jay-Z',
  'Pharrell Williams',
  'A$AP Rocky',
  'A$AP Yams',
  'Tyler, the Creator',
  'Andr\u00e9 3000',
  'Erick Sermon',
  'Slick Rick',
  'Dapper Dan',
  'Virgil Abloh',
  'Kerby Jean-Raymond',
  'Telfar Clemens',
  'Aurora James',
  'Olivier Rousteing',
  'Romeo Hunte',
  'Lazaro Hernandez',
  'Edward Enninful',
  'Andr\u00e9 Leon Talley',

  // Athletes-as-dandies
  'Lewis Hamilton',
  'LeBron James',
  'Russell Westbrook',
  'James Harden',
  'Cam Newton',
  'Dwyane Wade',
  'Allen Iverson',
  'Serena Williams',
  'Naomi Osaka',
  'Jackie Robinson',
  'Muhammad Ali',
  'Arthur Ashe',
  'Florence Griffith Joyner',

  // Contemporary actors
  'Denzel Washington',
  'Will Smith',
  'Idris Elba',
  'Mahershala Ali',
  'Lakeith Stanfield',
  'Daniel Kaluuya',
  'Colman Domingo',
  'Donald Glover',
  'Jamie Foxx',
  'Chadwick Boseman',
  'Michael B. Jordan',
  'Sterling K. Brown',
  'Andre Holland',
  'Trevante Rhodes',
  'Lupita Nyong\u2019o',
  'Viola Davis',
  'Regina King',
  'Cicely Tyson',
  'Tracee Ellis Ross',

  // Visual artists + photographers
  'Romare Bearden',
  'Jacob Lawrence',
  'Gordon Parks',
  'Roy DeCarava',
  'Carrie Mae Weems',
  'Kara Walker',
  'Kehinde Wiley',
  'Mickalene Thomas',
  'Lorna Simpson',
  'Theaster Gates',
  'Mark Bradford',
  'Henry Taylor',

  // West African diasporic style
  'Malick Sidib\u00e9',
  'Seydou Ke\u00efta',
  'Mama Casset',
  'Solange Azagury-Partridge',
  'Duro Olowu',
  'Iman Abdulmajid',
  'Naomi Campbell',
  'Alek Wek',

  // Designers / Vogue era
  'Ann Lowe',
  'Patrick Kelly',
  'Stephen Burrows',
  'Tracy Reese',
  'Carly Cushnie',
  'Brandon Maxwell',
  'Christopher John Rogers',
  'Aurora James',
  'Recho Omondi',

  // Producers + DJs (Sunday-OS adjacent — the catalog rhyme)
  'Frankie Knuckles',
  'Larry Levan',
  'Larry Heard',
  'Theo Parrish',
  'Moodymann',
  'Honey Dijon',
  'Kerri Chandler',
  'Marshall Jefferson',
  'Ron Hardy',
  'Lil Louis',
];

// Sort once at module load. Strip leading articles for sort key.
function sortKey(name: string): string {
  return name.replace(/^the\s+/i, '').toLowerCase();
}

export const CURATED_NAMES = [...RAW_NAMES].sort((a, b) =>
  sortKey(a).localeCompare(sortKey(b))
);

export interface ListEntry {
  name: string;
  /** ms epoch timestamp; 0 for curated entries */
  addedAt: number;
  /** true if this entry came from a paid user add */
  paid: boolean;
}

export const CURATED_ENTRIES: ListEntry[] = CURATED_NAMES.map((name) => ({
  name,
  addedAt: 0,
  paid: false,
}));
