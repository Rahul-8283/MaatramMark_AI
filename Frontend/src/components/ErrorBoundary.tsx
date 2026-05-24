import React from 'react'

type State = { hasError: boolean }

export default class ErrorBoundary extends React.Component<{ children?: React.ReactNode }, State> {
  constructor(props: { children?: React.ReactNode }) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError() {
    return { hasError: true }
  }

  componentDidCatch(_error: Error, _info: any) {
    // You can log errors to a service here
    // console.error(_error, _info)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="p-8 text-center">
          <h2 className="text-xl font-bold text-white">Something went wrong.</h2>
          <p className="text-slate-300">Please refresh the page or contact support.</p>
        </div>
      )
    }

    return this.props.children
  }
}
