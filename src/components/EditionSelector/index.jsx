import { useState } from 'react'
import { EditionContainer, EditionIcon } from './style'
import { editions } from '../../services/utils'

const EditionSelector = ({ selectedEdition, onSelect }) => {
  return (
    <EditionContainer>
      <EditionIcon
        src="/all-editions.png"
        alt="Todas"
        onClick={() => onSelect(null)}
        selected={selectedEdition === null}
        title="Todas edições"
      />
      {Object.entries(editions).map(([key, name]) => (
        <EditionIcon
          key={key}
          src={`https://hcunits.net/static/images/set/${key}/icon.svg`}
          alt={name}
          title={name}
          onClick={() => onSelect(key)}
          selected={selectedEdition === key}
        />
      ))}
    </EditionContainer>
  )
}

export { EditionSelector }
