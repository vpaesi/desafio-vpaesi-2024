class RecintosZoo {
  constructor() {
    this.recintos = [
      {
        numero: 1,
        bioma: "savana",
        tamanhoTotal: 10,
        animaisExistentes: [{ especie: "MACACO", quantidade: 3, tamanho: 1 }],
      },
      { numero: 2, bioma: "floresta", tamanhoTotal: 5, animaisExistentes: [] },
      {
        numero: 3,
        bioma: "savana e rio",
        tamanhoTotal: 7,
        animaisExistentes: [{ especie: "GAZELA", quantidade: 1, tamanho: 2 }],
      },
      { numero: 4, bioma: "rio", tamanhoTotal: 8, animaisExistentes: [] },
      {
        numero: 5,
        bioma: "savana",
        tamanhoTotal: 9,
        animaisExistentes: [{ especie: "LEAO", quantidade: 1, tamanho: 3 }],
      },
    ];

    this.animais = {
      LEAO: { tamanho: 3, biomas: ["savana"], carnivoro: true },
      LEOPARDO: { tamanho: 2, biomas: ["savana"], carnivoro: true },
      CROCODILO: { tamanho: 3, biomas: ["rio"], carnivoro: true },
      MACACO: { tamanho: 1, biomas: ["savana", "floresta"], carnivoro: false },
      GAZELA: { tamanho: 2, biomas: ["savana"], carnivoro: false },
      HIPOPOTAMO: { tamanho: 4, biomas: ["savana", "rio"], carnivoro: false },
    };
  }

  analisaRecintos(especie, quantidade) {
    const resultado = { erro: null, recintosViaveis: null };

    const animal = this.animais[especie.toUpperCase()];
    if (!animal) {
      resultado.erro = "Animal inválido";
      return resultado;
    }

    if (quantidade <= 0) {
      resultado.erro = "Quantidade inválida";
      return resultado;
    }

    const recintosViaveis = this.recintos.filter((recinto) =>
      this.verificaRecintoViavel(animal, especie, quantidade, recinto)
    );

    if (recintosViaveis.length === 0) {
      resultado.erro = "Não há recinto viável";
    } else {
      resultado.recintosViaveis = recintosViaveis.map(
        (r) =>
          `Recinto ${r.numero} (espaço livre: ${r.espacoLivre} total: ${r.tamanhoTotal})`
      );
    }

    return resultado;
  }

  verificaRecintoViavel(animal, especie, quantidade, recinto) {
    console.log(
      `\nVerificando recinto viável para ${quantidade} ${especie}(s) no Recinto ${recinto.numero}`
    );

    if (!animal.biomas.some((bioma) => recinto.bioma.includes(bioma))) {
      console.log(
        `Recinto ${recinto.numero} rejeitado: bioma incompatível (${recinto.bioma})`
      );
      return false;
    }

    const existeCarnivoroNoRecinto = recinto.animaisExistentes.some(
      (a) => this.animais[a.especie].carnivoro
    );
    const existeOutraEspecie = recinto.animaisExistentes.some(
      (a) => a.especie !== especie
    );

    console.log(`Carnívoro no recinto? ${existeCarnivoroNoRecinto}`);
    console.log(`Outra espécie no recinto? ${existeOutraEspecie}`);

    if (
      (animal.carnivoro && existeOutraEspecie) ||
      (!animal.carnivoro && existeCarnivoroNoRecinto)
    ) {
      console.log(
        `Recinto ${recinto.numero} rejeitado: carnívoro com outra espécie ou não carnívoro com carnívoro`
      );
      return false;
    }

    const recintoComSavanaERio =
      recinto.bioma.includes("savana") && recinto.bioma.includes("rio");
    if (
      especie === "HIPOPOTAMO" &&
      existeOutraEspecie &&
      !recintoComSavanaERio
    ) {
      console.log(
        `Recinto ${recinto.numero} rejeitado: hipopótamo precisa de savana e rio para coexistir com outra espécie`
      );
      return false;
    }

    if (
      especie === "MACACO" &&
      recinto.animaisExistentes.length === 0 &&
      quantidade === 1
    ) {
      console.log(
        `Recinto ${recinto.numero} rejeitado: macaco não pode estar sozinho`
      );
      return false;
    }

    let espacoOcupado = recinto.animaisExistentes.reduce(
      (total, a) => total + a.quantidade * this.animais[a.especie].tamanho,
      0
    );
    console.log(
      `Espaço ocupado inicialmente no Recinto ${recinto.numero}: ${espacoOcupado}`
    );

    if (existeOutraEspecie) {
      espacoOcupado += 1;
      console.log(
        `Espaço extra adicionado devido a outra espécie presente. Novo espaço ocupado: ${espacoOcupado}`
      );
    }

    const espacoNecessario = quantidade * animal.tamanho;
    const espacoLivre = recinto.tamanhoTotal - espacoOcupado;

    console.log(
      `Espaço necessário para ${quantidade} ${especie}(s): ${espacoNecessario}`
    );
    console.log(
      `Espaço livre no Recinto ${recinto.numero} após cálculo: ${espacoLivre}`
    );

    if (espacoLivre >= espacoNecessario) {
      recinto.espacoLivre = espacoLivre - espacoNecessario;
      console.log(
        `Recinto ${recinto.numero} é viável. Espaço restante: ${recinto.espacoLivre}`
      );
      return true;
    }

    console.log(`Recinto ${recinto.numero} rejeitado: espaço insuficiente`);
    return false;
  }
}

export { RecintosZoo as RecintosZoo };
