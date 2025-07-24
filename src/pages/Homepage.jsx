import { Input } from '@/components/ui/input'
import React from 'react'

const Homepage = () => {
  return (
    <>
      <div>Homepage</div>
      <Input
        type="text"
        placeholder="Search..."
        className="w-full max-w-md mx-auto mt-4"
        autoFocus
      />
    </>
  )
}

export default Homepage