const db = require("../config/database");

exports.post = async (req, res) => {
  const { nome, n1, n2, n3, n4 } = req.fields;

  let [erro, msgsErro] = validaNotas(req.fields);
  let name = validaNome(nome); 

  if (!erro && name) {
    const aluno = await db.query(
      "INSERT INTO alunos (nome) VALUES ($1) RETURNING *",
      [nome]
    );
    const idAluno = aluno.rows[0].id;

    const notas = await db.query(
      "INSERT INTO notas (idaluno, n1, n2, n3, n4) VALUES ($1, $2, $3, $4, $5) RETURNING *",
      [idAluno, n1, n2, n3, n4]
    );

    res.status(201).send({
      message: "Sucesso",
      body: {
        alunos: aluno.rows[0],
        notas: notas.rows[0],
      },
    });
  } else { 
    if (!name){
      msgsErro.push("Verifique se o nome foi digitado coretamente, sem números ou caracteres especiais.")
    }
    res.status(400).send({
      message: "Denied",
      body: {
        errors: msgsErro,
      },
    });
  }
};

exports.edit = async (req, res) => {
  const { nome, n1, n2, n3, n4, id } = req.fields;
  console.log(nome, n1, n2, n3, n4, id);
  const aluno = await db.query(
    "UPDATE alunos SET nome = $1 WHERE alunos.id = $2",
    [nome, id]
  );

  const notas = await db.query(
    "UPDATE notas SET n1 = $1, n2 = $2, n3 = $3, n4 = $4 WHERE notas.idaluno = $5 ",
    [n1, n2, n3, n4, id]
  );

  res.status(201).send({
    message: "Successo",
    body: {
      alunos: aluno.rows[0],
      notas: notas.rows[0],
    },
  });
};

exports.get = async (req, res) => {
  const { nome, n1, n2, n3, n4 } = req.fields;
  const aluno = await db.query("SELECT * FROM alunos");

  const notas = await db.query("SELECT * FROM notas");

  res.status(201).send({
    message: "Product added successfully!",
    body: {
      alunos: aluno.rows,
      notas: notas.rows,
    },
  });
};

exports.getAll = async (req, res) => {
  const { id } = req.params;
  const { rows } = await db.query(
    "select * from alunos a inner join notas n on a.id = n.idaluno"
  );

  var student = rows.map((item) => {
    let { n1, n2, n3, n4 } = item;
    let media = (n1 + n2 + n3 + n4) / 4;
    item.media = media;
    item.status = verificaAprovacao(media);
    return item;
  });

  res.status(201).send({
    message: getMessage(rows),
    body: {
      alunos: student,
    },
  });
};

exports.getAluno = async (req, res) => {
  const { id } = req.params;
  const { rows } = await db.query(
    "select * from alunos a inner join notas n on a.id = n.idaluno WHERE a.id = $1",
    [id]
  );

  var student = rows.map((item) => {
    let { n1, n2, n3, n4 } = item;
    let media = (n1 + n2 + n3 + n4) / 4;
    item.media = media;
    item.status = verificaAprovacao(media);
    return item;
  });

  res.status(201).send({
    message: getMessage(rows),
    body: {
      aluno: student,
    },
  });
};

function getMessage(rows) {
  if (rows) return "Sucesso";
  else return "Não encontrado";
}

function verificaAprovacao(media) {
  if (media >= 6) return "Aprovado";
  else if (media >= 4 && media < 6) return "Recuperação";
  else return "Reprovado";
}

function validacao(nota) {
  if (isNaN(nota)) {
    return 0;
  } else {
    if (Number.isInteger(nota)) {
      return 1;
    } else return 0;
  }
}

function validaNotas(item) {
  const campos = ["n1", "n2", "n3", "n4"];
  let erro = false;

  var msgsErro = campos
    .map((c) => {
      item[c] = validacao(Number(item[c]));
      if (erro === false) {
        erro = item[c] ? false : true;
      }
      return item[c]
        ? null
        : "Nota " +
            c +
            " está invalida. Não é um numero inteiro ou não é um número";
    })
    .filter((item) => {
      return verificaNull(item)? item:null
    
    
    });

  return [erro, msgsErro];
}

function verificaNull(item) {
  return typeof item === null ? false : true;
}

function validaNome(nome){
  console.log(nome.match(/[A-Z][a-z]* [A-Z][a-z]*/), nome)
  return !!nome.match(/[A-Z][a-z]* [A-Z][a-z]*/) ;
}
