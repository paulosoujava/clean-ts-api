module.exports = {
  extends: 'standard-with-typescript',
  parserOptions: {
    project: './tsconfig.json'
  },
  rules: {
    '@typescript-eslint/strict-boolean-expressions': 'off',
    '@typescript-eslint/consistent-type-definitions': 'off',
    '@typescript-eslint/comma-spacing': 'off',
    // caso nao queira usar o pdarao do esllint descomente abaixo
    // padrao eslint:
    // decrypt: (value: string) => Promisse<string>
    // '@typescript-eslint/method-signature-style': 'off'
    '@typescript-eslint/return-await': 'off'

  }
}
