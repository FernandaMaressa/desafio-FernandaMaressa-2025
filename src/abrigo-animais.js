class AbrigoAnimais {
  constructor() {
    this.animais = {
      rex:  { nome: 'Rex',  especie: 'cão',   brinquedos: ['RATO', 'BOLA'] },
      mimi: { nome: 'Mimi', especie: 'gato',  brinquedos: ['BOLA', 'LASER'] },
      fofo: { nome: 'Fofo', especie: 'gato',  brinquedos: ['BOLA', 'RATO', 'LASER'] },
      zero: { nome: 'Zero', especie: 'gato',  brinquedos: ['RATO', 'BOLA'] },
      bola: { nome: 'Bola', especie: 'cão',   brinquedos: ['CAIXA', 'NOVELO'] },
      bebe: { nome: 'Bebe', especie: 'cão',   brinquedos: ['LASER', 'RATO', 'BOLA'] },
      loco: { nome: 'Loco', especie: 'jabuti',brinquedos: ['SKATE', 'RATO'] }
    };

    this.brinquedosValidos = new Set(
      Object.values(this.animais).flatMap(a => a.brinquedos)
    );
  }

  encontraPessoas(brinquedosPessoa1, brinquedosPessoa2, ordemAnimais) {
    const parseLista = (s, normalizeFn) =>
      (typeof s === 'string' && s.length > 0) ? s.split(',').map(x => normalizeFn(x.trim())) : [];

    const brinquedos1 = parseLista(brinquedosPessoa1, t => t.toUpperCase());
    const brinquedos2 = parseLista(brinquedosPessoa2, t => t.toUpperCase());
    const ordem = parseLista(ordemAnimais, a => a.toLowerCase());

    if (ordem.length === 0) {
      return { erro: 'Animal inválido!' };
    }

    for (const a of ordem) {
      if (!this.animais[a]) {
        return { erro: 'Animal inválido!' };
      }
    }
   
    if (new Set(ordem).size !== ordem.length) {
      return { erro: 'Animal inválido!' };
    }

    const temDuplicado = arr => new Set(arr).size !== arr.length;
    if (temDuplicado(brinquedos1) || temDuplicado(brinquedos2)) {
      return { erro: 'Brinquedo inválido!' };
    }
    
    for (const b of [...brinquedos1, ...brinquedos2]) {
      if (!this.brinquedosValidos.has(b)) {
        return { erro: 'Brinquedo inválido!' };
      }
    }

    const isSubsequencia = (favs, toys) => {
      if (favs.length === 0) return true;
      let i = 0;
      for (const t of toys) {
        if (t === favs[i]) i++;
        if (i === favs.length) break;
      }
      return i === favs.length;
    };

    const matches = (personToys, animalKey) => {
      const animal = this.animais[animalKey];
      const favs = animal.brinquedos;
      if (animalKey === 'loco') {
        const s = new Set(personToys);
        return favs.every(f => s.has(f));
      }
      return isSubsequencia(favs, personToys);
    };

    const willMatchOtherLater = (personToys, currentIndex) => {
      for (let j = currentIndex + 1; j < ordem.length; j++) {
        const otherKey = ordem[j];
        if (matches(personToys, otherKey)) return true;
      }
      return false;
    };

    const allocation = {};
    let countP1 = 0;
    let countP2 = 0;

    for (let i = 0; i < ordem.length; i++) {
      const key = ordem[i];
      const animal = this.animais[key];

      const p1 = matches(brinquedos1, key);
      const p2 = matches(brinquedos2, key);

      if (p1 && p2) {
        allocation[animal.nome] = 'abrigo';
        continue;
      }

      if (p1 && !p2) {
        if (countP1 >= 3) {
          allocation[animal.nome] = 'abrigo';
          continue;
        }
        if (key === 'loco') {
          const hasCompany = countP1 > 0 || willMatchOtherLater(brinquedos1, i);
          if (!hasCompany) {
            allocation[animal.nome] = 'abrigo';
            continue;
          }
        }
        allocation[animal.nome] = 'pessoa 1';
        countP1++;
        continue;
      }

      if (p2 && !p1) {
        if (countP2 >= 3) {
          allocation[animal.nome] = 'abrigo';
          continue;
        }
        if (key === 'loco') {
          const hasCompany = countP2 > 0 || willMatchOtherLater(brinquedos2, i);
          if (!hasCompany) {
            allocation[animal.nome] = 'abrigo';
            continue;
          }
        }
        allocation[animal.nome] = 'pessoa 2';
        countP2++;
        continue;
      }

      allocation[animal.nome] = 'abrigo';
    }

    const lista = Object.keys(allocation)
      .sort((a, b) => a.localeCompare(b))
      .map(nome => `${nome} - ${allocation[nome]}`);

    return { lista };
  }
}

export { AbrigoAnimais as AbrigoAnimais };
