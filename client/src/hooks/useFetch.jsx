//custom hook to fetch gifs

import { useEffect, useState } from "react";

const API_KEY  = import.meta.env.GIPHY_API; //importing APIKEY

const useFetch = ({keyword})=>{
    const [gifUrl, setGifUrl] = useState(""); //set state of GifUrl

    const fetchGifs = async ()=>{  //function to fetch Gifs from Giphy API endpoint
        try {
            const response = await fetch(`https://api.giphy.com/v1/gifs/search?api_key=${API_KEY}&q=${keyword.split(" ").join("")}&limit=1`) //need an endpoint from which to fetch gifs, dynamically q takes keyword from the input
            //if multiple words, then split the entire word with space and join them all together to create one word w/o spaces, limit is 1
            const {data} = await response.json(); //destructure data from response json 

            setGifUrl(data[0]?.images?.downsized_medium?.url) //check if every prop of data object exist
        } catch (error) {
            setGifUrl('https://metro.co.uk/wp-content/uploads/2015/05/pokemon_crying.gif?quality=90&strip=all&zoom=1&resize=500%2C284'); //if no gif found, setUrl for a demo gif
        }
    }

    useEffect(()=>{ //calls fetchGifs() whenever keyword input changes 
       if(keyword)
       fetchGifs();
    }, [keyword])

    return gifUrl; //useFetch() returns gifURL
}

export default useFetch