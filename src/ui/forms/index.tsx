"use client";


/**
 * Primitivos de formulário do ContaUp.
 *
 * Todo formulário do app deve ser montado com estes componentes — eles são a
 * única fonte dos estilos de campo (cores vêm dos tokens MD3 em globals.css,
 * nunca de hex inline).
 */

export { Field, FormSection, FormAlert } from "./Field";
export { Input, Textarea, Select } from "../input/Input";
export { Button } from "../button/Button";
export type { ButtonProps } from "../button/Button";
