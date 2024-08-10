import { TouchableOpacity, Image } from "react-native";


export default function ImageButton({ imagePath, imageStyle } : any){

    return(
        
        <TouchableOpacity>

            <Image source={imagePath} style={imageStyle}/>

        </TouchableOpacity>

    );

}