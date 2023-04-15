import { PencilSimple } from 'phosphor-react'

const EditButton = ({ onClick }) => {
  return (
    <button className="w-8 h-8 rounded-full bg-white shadow-md my-5 ml-2 text-black hover:text-[#268DC7] transition-none" onClick={onClick}>
        <PencilSimple size="18" className = "mx-auto"/>
    </button>
  )
}

export default EditButton
