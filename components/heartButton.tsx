import { Heart } from 'phosphor-react'

const HeartButton = ({ onClick }) => {
  return (
        <button className="w-8 h-8 rounded-full bg-white shadow-md my-5" onClick={onClick}>
            <Heart color="black" size="18" className = "mx-auto"/>
        </button>
  )
}

export default HeartButton
