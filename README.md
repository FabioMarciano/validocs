# Validocs

**Validocs** is a documents and patterns validator library.

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

# Tests

## Regular test

```shell
$ npm run test
```

---

## Coverage

This command runs all tests and outputs a report<sup>1</sup> about its coverage.

```shell
$ npm run test:coverage
```

<sup>1</sup> The report outputs at **coverage** folder.

---

## Watching files

```shell
$ npm run test:watch
```

---

## ESLint

```shell
$ npm run lint
```

---

# Build

```shell
$ npm run build
```

<sup>\*</sup> Builds at **dist** folder
