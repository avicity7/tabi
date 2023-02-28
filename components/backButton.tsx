import { ArrowLeft } from "phosphor-react";
import { useRouter } from "next/router";

const BackButton = () => { 
    const router = useRouter();
    return( 
        <button className="absolute top-0 w-8 h-8 rounded-full bg-white shadow-md mx-5 my-5" onClick={() => {router.push('/')}}>
            <ArrowLeft color="black" size="18" className = "mx-auto"/>
        </button>
    )
}

export default BackButton