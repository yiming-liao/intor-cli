<h1 align="center">intor-cli</h1>

<div align="center">
  
CLI tool for intor.

</div>

<div align="center">

[![NPM version](https://img.shields.io/npm/v/intor-cli?style=flat&colorA=000000&colorB=000000)](https://www.npmjs.com/package/intor-cli)
[![TypeScript](https://img.shields.io/badge/TypeScript-%E2%9C%94-blue?style=flat&colorA=000000&colorB=000000)](https://www.typescriptlang.org/)
[![License](https://img.shields.io/npm/l/intor-cli?style=flat&colorA=000000&colorB=000000)](LICENSE)

<table>
  <tr>
    <td align="center">
      <img src="generate-demo.gif" />
    </td>
    <td align="center">
      <img src="check-demo.gif" />
    </td>
  </tr>
</table>
</div>

## Usage

#### generate

```bash
npx intor-cli generate
```

- Generates TypeScript types and schema artifacts
- Designed to be safe, deterministic, and non-intrusive
- Displays runtime message override details during generation

#### check

```bash
npx intor-cli check
```

- Statically extracts translator usages from your codebase
- Validates preKey, message keys, replacements, and rich tags
- Reports diagnostics with precise source locations

## Design Guarantees

- Message types are inferred from the **_default locale_** only.
- All locales are assumed to share the same message shape.
- Locale is treated as a runtime dimension, not a structural one.
- Generated types are intentionally conservative and do not validate locale completeness.
