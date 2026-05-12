import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import type { EmailLogEntry } from "../quotes.types"

function formatDateTime(dateStr: string): string {
  return new Date(dateStr).toLocaleString(undefined, {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  })
}

interface EmailHistoryProps {
  emails: EmailLogEntry[]
}

export function EmailHistory({ emails }: EmailHistoryProps) {
  if (emails.length === 0) {
    return (
      <p className="py-8 text-center text-sm text-ink-mute">
        No emails sent yet.
      </p>
    )
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Recipient</TableHead>
          <TableHead>Sent</TableHead>
          <TableHead>Opened</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {emails.map((e) => (
          <TableRow key={e.id}>
            <TableCell className="text-ink">{e.recipient}</TableCell>
            <TableCell className="text-ink-mute">
              {formatDateTime(e.sentAt)}
            </TableCell>
            <TableCell>
              {e.openedAt ? (
                <span className="text-moss">{formatDateTime(e.openedAt)}</span>
              ) : (
                <span className="text-ink-mute">Not opened yet</span>
              )}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
