import { AbrigoAnimais } from "./abrigo-animais";

describe('Abrigo de Animais', () => {

  test('Deve rejeitar animal inválido', () => {
    const resultado = new AbrigoAnimais().encontraPessoas('CAIXA,RATO', 'RATO,BOLA', 'Lulu');
    expect(resultado.erro).toBe('Animal inválido!');
    expect(resultado.lista).toBeFalsy();
  });

  test('Deve encontrar pessoa para um animal', () => {
    const resultado = new AbrigoAnimais().encontraPessoas(
      'RATO,BOLA', 'RATO,NOVELO', 'Rex,Fofo');
      expect(resultado.lista[0]).toBe('Fofo - abrigo');
      expect(resultado.lista[1]).toBe('Rex - pessoa 1');
      expect(resultado.lista.length).toBe(2);
      expect(resultado.erro).toBeFalsy();
  });

  test('Deve encontrar pessoa para um animal intercalando brinquedos', () => {
    const resultado = new AbrigoAnimais().encontraPessoas(
      'BOLA,LASER',
      'BOLA,NOVELO,RATO,LASER',
      'Mimi,Fofo,Rex,Bola'
    );

    expect(resultado.lista[0]).toBe('Bola - abrigo');
    expect(resultado.lista[1]).toBe('Fofo - pessoa 2');
    expect(resultado.lista[2]).toBe('Mimi - abrigo');
    expect(resultado.lista[3]).toBe('Rex - abrigo');
    expect(resultado.lista.length).toBe(4);
    expect(resultado.erro).toBeFalsy();
  });

  test('Deve rejeitar brinquedo inválido', () => {
    const resultado = new AbrigoAnimais().encontraPessoas('CARRO', 'LASER', 'Rex');
    expect(resultado.erro).toBe('Brinquedo inválido!');
  });

  test('Deve rejeitar brinquedo duplicado', () => {
    const resultado = new AbrigoAnimais().encontraPessoas('RATO,RATO', 'BOLA', 'Rex');
    expect(resultado.erro).toBe('Brinquedo inválido!');
  });

  test('Deve rejeitar animal duplicado', () => {
    const resultado = new AbrigoAnimais().encontraPessoas('RATO,BOLA', 'LASER', 'Rex,Rex');
    expect(resultado.erro).toBe('Animal inválido!');
  });

  test('Se ambas as pessoas puderem adotar, o animal fica no abrigo', () => {
    const resultado = new AbrigoAnimais().encontraPessoas('RATO,BOLA', 'RATO,BOLA', 'Rex');
    expect(resultado.lista).toEqual(['Rex - abrigo']);
  });

 test('Uma pessoa não pode adotar mais de 3 animais', () => {
  const resultado = new AbrigoAnimais().encontraPessoas(
    'RATO,BOLA,CAIXA,NOVELO,LASER',
    'LASER',
    'Rex,Bola,Bebe,Fofo,Mimi'
  );
  
  expect(resultado.lista).toContain('Fofo - abrigo');
  expect(resultado.lista).toContain('Mimi - pessoa 1');
  });


  test('Loco deve ficar no abrigo se estiver sozinho', () => {
    const resultado = new AbrigoAnimais().encontraPessoas('SKATE,RATO', '', 'Loco');
    expect(resultado.lista).toEqual(['Loco - abrigo']);
  });

  test('Loco pode ser adotado se houver outro animal junto', () => {
    const resultado = new AbrigoAnimais().encontraPessoas('RATO,BOLA,SKATE', '', 'Rex,Loco');
    expect(resultado.lista).toContain('Rex - pessoa 1');
    expect(resultado.lista).toContain('Loco - pessoa 1');
  });
});
