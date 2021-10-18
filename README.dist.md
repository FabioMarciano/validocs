# Validocs

**Validocs** library for document and pattern validation.

# Features

The current list of documents and patterns implemented on this project are:

- **CPF** \
   Cadastro Pessoas Físicas (_brazilian federal document required for natural persons_)
- **CNPJ** \
   Cadastro Nacional de Pessoas Jurídicas (_brazilian federal document required for legal persons_)
- **PIS** \
   Programa de Integração Social (_brazilian federal document required for natural persons_)

# Collaborators

- Fabio Marciano <fabioamarciano@gmail.com>

# License

This project is licensed under the terms of the MIT license.

# Quickstart

## Install

```shell
$ npm install validocs --save
```

---

## Usage

_Typescript_ example:

Import and use a module:

```typescript
import CPF from 'validocs/cpf';

const cpf: CPF.Cpf = CPF.make();

console.log(`Generated CPF number: ${cpf}`);
```

# Documentation

The projects wiki is available at [github](https://github.com/FabioMarciano/validocs/wiki).
