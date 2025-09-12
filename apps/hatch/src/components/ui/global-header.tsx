export default function GlobalHeader() {
  return (
    <header className="border-b bg-gray-50">
      <div className="mx-auto px-4 py-3">
        <div className="grid grid-cols-[1fr_auto_1fr] items-center">
          {/* Left spacer (sidebar already shows Warren logo) */}
          <div />

          {/* Center: Warren wordmark + discovery tool name */}
          <div className="flex items-center justify-center gap-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-[#64B37A] to-[#2F6D49] rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-sm">W</span>
              </div>
              <span className="font-semibold text-gray-900">Warren</span>
            </div>
            <div className="h-4 w-px bg-gray-300" aria-hidden />
            <span className="text-sm font-medium text-gray-900">Discovery Tool</span>
          </div>

          {/* Right: Client logo placeholder */}
          <div className="flex items-center justify-end">
            <div className="w-11 h-11 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center ring-1 ring-gray-300">
              <span className="text-gray-500 font-semibold text-sm">CL</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}