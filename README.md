# Validocs

**Validocs** is a document and patterns validator library.

# Collaborators

- Fabio Marciano <fabioamarciano@gmail.com>

# License

This project is licensed under the terms of the MIT license.

# Quickstart

## Install

```shell
$ npm install validocs --save
```

## Usage

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

## Coverage

This command runs all tests and outputs a report[^1] about the the tests coverage.

```shell
$ npm run test:coverage
```

[^1] The report outputs at **coverage/lcov-report**.

## Watch files

```shell
$ npm run test:watch
```

## ESLint

```shell
$ npm run lint
```

# Build

The command builds for distribuition at **dist** folder.

```shell
$ npm run build
```
