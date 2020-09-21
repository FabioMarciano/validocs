# Validocs

Validator for multiple documents.

# Collaborators

- Fabio Marciano <fabioamarciano@gmail.com>

# License

This project is licensed under the terms of the MIT license.

# Quickstart

## Install

```shell
$ npm install validocs
```

## Usage

Import one module to use:

```typescript
import CPF from 'validocs/cpf';

const cpf: CPF.CPF = CPF.make();

console.log('CPF number:', cpf);
```

# Tests

```shell
$ npm run test
```
