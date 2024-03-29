import { ArrowLeft } from 'phosphor-react'

const BackButton = ({ onClick }) => {
  return (
        <button className="w-8 h-8 rounded-full bg-white shadow-md my-5" onClick={onClick}>
            <ArrowLeft color="black" size="18" className = "mx-auto"/>
        </button>
  )
}

export default BackButton
