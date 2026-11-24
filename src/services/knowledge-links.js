export function publicationHref(slug){return "/espacio-del-saber/?articulo="+encodeURIComponent(slug);}
export function documentLabel(type){return ({research:"Investigación",article:"Artículo",guide:"Guía",report:"Informe",journal:"Revista"})[type]||"Documento";}
export function safeImage(value){try{const u=new URL(value);return u.protocol==="https:"&&!u.username&&!u.password?u.href:"";}catch{return "";}}
export function drivePreview(post){
 try{const u=new URL(post.driveUrl);const id=post.driveFileId;if(!/^[A-Za-z0-9_-]{10,255}$/.test(id)||u.protocol!=="https:"||u.host!=="drive.google.com"||u.username||u.password||u.pathname!=="/file/d/"+id+"/view")return "";
 const p=new URL("https://drive.google.com/file/d/"+id+"/preview");const key=u.searchParams.get("resourcekey");if(key&&/^[A-Za-z0-9_-]{1,255}$/.test(key))p.searchParams.set("resourcekey",key);return p.href;}catch{return "";}
}
