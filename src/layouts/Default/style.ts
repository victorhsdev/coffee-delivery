import styled from "styled-components";

export const LayoutContainer = styled.div`
  width: 100%;
  padding: 0 24rem;

  @media screen and (max-width:1920px){
    padding: 0 15rem;
  }

  @media screen and (max-width:1600px){
    padding: 0 10rem;
  }

  @media screen and (max-width:920px){
    padding: 0 6rem;
  }
  
  @media screen and (max-width:720px){
    padding: 0 4rem;
  }

  @media screen and (max-width:450px){
    padding: 0 1.5rem;
  }

`;