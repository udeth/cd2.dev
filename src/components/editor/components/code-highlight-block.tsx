import './code-highlight-block.css';

import type { NodeViewProps } from '@tiptap/react';

import { useCallback } from 'react';
import { NodeViewContent, NodeViewWrapper } from '@tiptap/react';

import { editorClasses } from '../classes';

// ----------------------------------------------------------------------

export function CodeHighlightBlock({ node, extension, updateAttributes }: NodeViewProps) {
  const { language } = node.attrs;
  const { lowlight } = extension.options;

  const handleChangeLanguage = useCallback(
    (event: React.ChangeEvent<HTMLSelectElement>) => {
      updateAttributes({ language: event.target.value });
    },
    [updateAttributes]
  );

  const renderLanguageOptions = () =>
    lowlight.listLanguages().map((lang: string) => (
      <option key={lang} value={lang}>
        {lang}
      </option>
    ));

  return (
    <NodeViewWrapper className={editorClasses.content.codeBlock}>
      <select
        name="language"
        contentEditable={false}
        value={language || 'null'}
        onChange={handleChangeLanguage}
        className={editorClasses.content.langSelect}
      >
        <option value="null">auto</option>
        <option disabled>—</option>
        {renderLanguageOptions()}
      </select>

      <pre>
        <NodeViewContent as="code" />
      </pre>
    </NodeViewWrapper>
  );
}
