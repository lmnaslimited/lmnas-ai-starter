type Props = {
  text: string
}

export default function AIInsightBlock({ text }: Props) {
  return (
    <div className="mt-6 p-4 bg-gray-100 rounded-lg">
      💡 {text}
    </div>
  )
}