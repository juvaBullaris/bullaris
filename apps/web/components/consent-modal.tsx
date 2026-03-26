'use client'

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/modal'
import { Button } from '@/components/ui/button'

// Consent version must be bumped when consent text changes
const CONSENT_VERSION = '1.0'

type ConsentModule =
  | 'payslip_module'
  | 'tax_planner'
  | 'ai_chat'
  | 'spending_tracker'
  | 'profile'

interface ModuleConsent {
  title: string
  dataCollected: string[]
  purpose: string
  retention: string
  visibility: string
}

const MODULE_CONSENT_INFO: Record<ConsentModule, ModuleConsent> = {
  payslip_module: {
    title: 'Lønseddel-forklarer',
    dataCollected: ['Bruttoløn (DKK)', 'Skattekorttype', 'Lønperiode'],
    purpose:
      'Beregne din nettoløn og vise en detaljeret nedbrydning af skat og bidrag.',
    retention: '13 måneder fra registrering.',
    visibility: 'Kun du. HR kan aldrig se dine individuelle løndata.',
  },
  tax_planner: {
    title: 'Skatteplan',
    dataCollected: ['Pendlerafstand', 'Fagforeningskontingent', 'Håndværkerudgifter'],
    purpose: 'Beregne dine skattefradrag og optimere din skattebetaling.',
    retention: '13 måneder fra registrering.',
    visibility: 'Kun du. HR kan aldrig se dine individuelle skattedata.',
  },
  ai_chat: {
    title: 'AI-finansassistent',
    dataCollected: ['Session-ID', 'Token-forbrug (antal)', 'Finansielt snapshot (løn, alder, kommune)'],
    purpose:
      'Besvare dine spørgsmål om skat og økonomi med personlig kontekst. Beskedindhold gemmes ALDRIG.',
    retention: '30 dage (sessions-logs).',
    visibility: 'Kun du og Bullaris til overvågning af ressourceforbrug. Ingen beskedindhold gemmes.',
  },
  spending_tracker: {
    title: 'Forbrugsoversigt',
    dataCollected: ['Budgetkategorier', 'Månedlige grænser', 'Forbrugsposter (beløb, kategori)'],
    purpose: 'Hjælpe dig med at overskue dit månedlige forbrug.',
    retention: '13 måneder fra registrering.',
    visibility: 'Kun du. Kontooplysninger gemmes aldrig.',
  },
  profile: {
    title: 'Profil',
    dataCollected: ['Navn', 'Alder', 'Kommune'],
    purpose: 'Personalisere din oplevelse og beregne kommuneskat korrekt.',
    retention: '30 dage efter fratrædelse.',
    visibility: 'Kun du og din HR-admin (navn + ansættelsesstatus — ikke finansielle data).',
  },
}

interface ConsentModalProps {
  module: ConsentModule
  onAccept: () => void
  onDecline: () => void
}

export function ConsentModal({ module, onAccept, onDecline }: ConsentModalProps) {
  const info = MODULE_CONSENT_INFO[module]

  return (
    <Dialog open>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Samtykke til {info.title}</DialogTitle>
          <DialogDescription>
            Inden du bruger dette modul, beder vi om dit udtrykkelige samtykke.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 text-sm">
          <div>
            <p className="font-medium mb-1">Hvilke data indsamles?</p>
            <ul className="list-disc list-inside text-muted-foreground space-y-0.5">
              {info.dataCollected.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
          <div>
            <p className="font-medium mb-1">Formål</p>
            <p className="text-muted-foreground">{info.purpose}</p>
          </div>
          <div>
            <p className="font-medium mb-1">Opbevaringstid</p>
            <p className="text-muted-foreground">{info.retention}</p>
          </div>
          <div>
            <p className="font-medium mb-1">Hvem kan se dine data?</p>
            <p className="text-muted-foreground">{info.visibility}</p>
          </div>
          <p className="text-xs text-muted-foreground border-t pt-3">
            Du kan til enhver tid trække dit samtykke tilbage under Indstillinger. Samtykke-version:{' '}
            {CONSENT_VERSION}.
          </p>
        </div>

        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={onDecline}>
            Nej tak
          </Button>
          <Button onClick={onAccept}>
            Jeg accepterer
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
