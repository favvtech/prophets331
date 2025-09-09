const url = 'https://byui-cse.github.io/cse-ww-program/data/latter-day-prophets.json';

const cards = document.querySelector('#cards');
const searchInput = document.querySelector('#search');
let allProphets = [];

async function getProphetData() {
  const response = await fetch(url);
  const data = await response.json();
  // console.table(data.prophets); // temporary testing of data response
  allProphets = data.prophets;
  renderSkeletons(8);
  // slight delay to show skeletons briefly
  requestAnimationFrame(() => displayProphets(allProphets));
}

const displayProphets = (prophets) => {
  cards.innerHTML = '';
  prophets.forEach((prophet) => {
    const card = document.createElement('section');
    const fullName = document.createElement('h2');
    const portrait = document.createElement('img');
    const dateInfo = document.createElement('p');
    const placeInfo = document.createElement('p');

    fullName.textContent = `${prophet.name} ${prophet.lastname}`;

    portrait.setAttribute('src', prophet.imageurl);
    portrait.setAttribute('alt', `Portrait of ${prophet.name} ${prophet.lastname}, Latter-day prophet`);
    portrait.setAttribute('loading', 'lazy');
    portrait.setAttribute('width', '340');
    portrait.setAttribute('height', '440');

    dateInfo.textContent = `Date of Birth: ${prophet.birthdate}`;
    placeInfo.textContent = `Place of Birth: ${prophet.birthplace}`;

    card.appendChild(fullName);
    card.appendChild(portrait);
    card.appendChild(dateInfo);
    card.appendChild(placeInfo);
    cards.appendChild(card);

    // Make Russell M. Nelson's card open a celebration page
    const isRussellNelson = `${prophet.name} ${prophet.lastname}` === 'Russell M. Nelson';
    if (isRussellNelson) {
      card.classList.add('celebration-target');
      card.addEventListener('click', () => {
        const params = new URLSearchParams({
          name: `${prophet.name} ${prophet.lastname}`,
          imageurl: prophet.imageurl,
          birthdate: prophet.birthdate,
          birthplace: prophet.birthplace
        });
        window.open(`celebration.html?${params.toString()}`, '_blank');
      });
    }
  });
};

function renderSkeletons(count) {
  cards.innerHTML = '';
  for (let i = 0; i < count; i++) {
    const shell = document.createElement('section');
    shell.className = 'card-skeleton';
    shell.innerHTML = `
      <div class="sk-title"></div>
      <div class="sk-image"></div>
      <div class="sk-line"></div>
      <div class="sk-line short"></div>
    `;
    cards.appendChild(shell);
  }
}

if (searchInput) {
  searchInput.addEventListener('input', (e) => {
    const q = e.target.value.toLowerCase().trim();
    if (!q) {
      displayProphets(allProphets);
      return;
    }
    const filtered = allProphets.filter((p) => {
      const name = `${p.name} ${p.lastname}`.toLowerCase();
      const birthplace = (p.birthplace || '').toLowerCase();
      return name.includes(q) || birthplace.includes(q);
    });
    displayProphets(filtered);
  });
}

getProphetData();


