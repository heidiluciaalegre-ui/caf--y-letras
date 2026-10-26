// Frases breves de obras literarias de dominio público.
const frasesLiterarias = [
  {
    frase: "¡Qué descansada vida la del que huye del mundanal ruido!",
    autor: "Fray Luis de León, «Vida retirada»"
  },
  {
    frase: "Volverán las oscuras golondrinas en tu balcón sus nidos a colgar.",
    autor: "Gustavo Adolfo Bécquer, «Rima LIII»"
  },
  {
    frase: "Yo sé un himno gigante y extraño que anuncia en la noche del alma una aurora.",
    autor: "Gustavo Adolfo Bécquer, «Rima I»"
  },
  {
    frase: "Caminante, no hay camino, se hace camino al andar.",
    autor: "Antonio Machado, «Proverbios y cantares» (XXIX)"
  },
  {
    frase: "La libertad, Sancho, es uno de los más preciosos dones que a los hombres dieron los cielos.",
    autor: "Miguel de Cervantes, «Don Quijote de la Mancha» (II, 58)"
  },
  {
    frase: "Ser o no ser, esa es la cuestión.",
    autor: "William Shakespeare, «Hamlet»"
  },
  {
    frase: "La belleza perece en la vida, pero es inmortal en el arte.",
    autor: "Leonardo da Vinci"
  },
  {
    frase: "No hay encanto igual a la ternura del corazón.",
    autor: "Jane Austen, «Emma»"
  },
  {
    frase: "Todo lo que vemos o parecemos es solamente un sueño dentro de un sueño.",
    autor: "Edgar Allan Poe"
  },
  {
    frase: "La esperanza es esa cosa con plumas que se posa en el alma.",
    autor: "Emily Dickinson"
  },
  {
    frase: "La experiencia es el nombre que damos a nuestros errores.",
    autor: "Oscar Wilde"
  }
];

const textoFrase = document.getElementById("texto-frase");
const autorFrase = document.getElementById("autor-frase");
const estadoFrase = document.getElementById("estado-frase");
const botonNuevaFrase = document.getElementById("btn-nueva-frase");
const botonCambiarTema = document.getElementById("btn-cambiar-tema");
const notificacion = document.getElementById("notificacion");
let libroEPUBActual = null;
let renditionEPUBActual = null;
let tamanoLetra = 18;
let temporizadorNotificacion;

function notificar(mensaje) {
  notificacion.textContent = mensaje;
  notificacion.classList.add("visible");
  window.clearTimeout(temporizadorNotificacion);
  temporizadorNotificacion = window.setTimeout(() => {
    notificacion.classList.remove("visible");
  }, 3000);
}

function mostrarFraseAleatoria() {
  const indiceAleatorio = Math.floor(Math.random() * frasesLiterarias.length);
  const fraseElegida = frasesLiterarias[indiceAleatorio];

  textoFrase.textContent = fraseElegida.frase;
  autorFrase.textContent = `— ${fraseElegida.autor}`;
  estadoFrase.textContent = "De la biblioteca de los grandes autores.";
}

function cambiarTema() {
  const activado = document.documentElement.classList.toggle("modo-oscuro");
  botonCambiarTema.setAttribute("aria-pressed", String(activado));
  document.querySelector('meta[name="theme-color"]').content = activado ? "#211b19" : "#f4eee4";
  actualizarTemaEPUB();
}

function actualizarTemaEPUB() {
  if (!renditionEPUBActual) {
    return;
  }

  const oscuro = document.documentElement.classList.contains("modo-oscuro");
  renditionEPUBActual.themes.default({
    body: {
      color: oscuro ? "#f1e8dc" : "#33251f",
      background: oscuro ? "#2b2421" : "#fffdf8",
      "line-height": String(tamanoInterlineado)
    }
  });
  renditionEPUBActual.themes.fontSize(`${tamanoLetra}px`);
}

botonNuevaFrase.addEventListener("click", mostrarFraseAleatoria);
botonCambiarTema.addEventListener("click", cambiarTema);

document.getElementById("btn-escuchar-frase").addEventListener("click", () => {
  if (!("speechSynthesis" in window) || typeof window.SpeechSynthesisUtterance !== "function") {
    estadoFrase.textContent = "La lectura en voz alta no está disponible en este navegador.";
    notificar("La lectura en voz alta no está disponible en este navegador.");
    return;
  }

  try {
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(
      new window.SpeechSynthesisUtterance(`${textoFrase.textContent} ${autorFrase.textContent}`)
    );
    estadoFrase.textContent = "Leyendo la frase en voz alta.";
    notificar("Leyendo la frase en voz alta.");
  } catch (error) {
    estadoFrase.textContent = "No se pudo iniciar la lectura en voz alta.";
    notificar("No se pudo iniciar la lectura en voz alta.");
  }
});

document.getElementById("btn-copiar-frase").addEventListener("click", async () => {
  const fraseCompleta = `${textoFrase.textContent} ${autorFrase.textContent}`;

  try {
    await copiarTexto(fraseCompleta);
    estadoFrase.textContent = "Frase copiada al portapapeles.";
    notificar("Frase copiada al portapapeles.");
  } catch (error) {
    estadoFrase.textContent = "No se pudo copiar la frase. Revisá los permisos del navegador.";
  }
});

async function copiarTexto(texto) {
  if (navigator.clipboard && window.isSecureContext) {
    await navigator.clipboard.writeText(texto);
    return;
  }

  const campoTemporal = document.createElement("textarea");
  campoTemporal.value = texto;
  campoTemporal.setAttribute("readonly", "");
  campoTemporal.className = "campo-copia-temporal";
  document.body.append(campoTemporal);
  campoTemporal.select();
  const copiado = document.execCommand("copy");
  campoTemporal.remove();

  if (!copiado) {
    throw new Error("El navegador no permitió copiar el texto.");
  }
}

document.getElementById("btn-guardar-frase").addEventListener("click", () => {
  const fraseCompleta = `${textoFrase.textContent} ${autorFrase.textContent}`;

  try {
    const frasesGuardadas = JSON.parse(localStorage.getItem("cafeLetrasFrasesGuardadas") || "[]");
    if (!frasesGuardadas.includes(fraseCompleta)) {
      frasesGuardadas.push(fraseCompleta);
    }
    localStorage.setItem("cafeLetrasFrasesGuardadas", JSON.stringify(frasesGuardadas));
    estadoFrase.textContent = "Frase guardada en este navegador.";
    notificar("Frase guardada en este navegador.");
  } catch (error) {
    estadoFrase.textContent = "No se pudo guardar la frase en este navegador.";
  }
});

const dialogoFrasesGuardadas = document.getElementById("dialogo-frases-guardadas");

function mostrarFrasesGuardadas() {
  const lista = document.getElementById("lista-frases-guardadas");
  const estado = document.getElementById("estado-frases-guardadas");
  lista.replaceChildren();

  try {
    const frasesGuardadas = JSON.parse(localStorage.getItem("cafeLetrasFrasesGuardadas") || "[]");
    if (!Array.isArray(frasesGuardadas) || frasesGuardadas.length === 0) {
      estado.textContent = "Todavía no guardaste frases.";
    } else {
      estado.textContent = `Tenés ${frasesGuardadas.length} frase${frasesGuardadas.length === 1 ? "" : "s"} guardada${frasesGuardadas.length === 1 ? "" : "s"}.`;
      frasesGuardadas.forEach((frase) => {
        const item = document.createElement("li");
        item.textContent = frase;
        lista.append(item);
      });
    }
  } catch (error) {
    estado.textContent = "No se pudieron cargar las frases guardadas en este navegador.";
  }

  dialogoFrasesGuardadas.showModal();
}

document.getElementById("btn-ver-frases-guardadas").addEventListener("click", mostrarFrasesGuardadas);

document.querySelectorAll(".boton-cerrar-dialogo").forEach((boton) => {
  boton.addEventListener("click", () => boton.closest("dialog").close());
});

const dialogoMesero = document.getElementById("dialogo-mesero");
document.getElementById("btn-abrir-mesero").addEventListener("click", () => dialogoMesero.showModal());

function activarPestana(idPanel) {
  document.querySelectorAll(".navegacion-pestanas [role='tab']").forEach((pestana) => {
    const seleccionada = pestana.dataset.panel === idPanel;
    pestana.classList.toggle("activa", seleccionada);
    pestana.setAttribute("aria-selected", String(seleccionada));
    document.getElementById(pestana.dataset.panel).hidden = !seleccionada;
  });
}

document.querySelectorAll(".navegacion-pestanas [role='tab']").forEach((pestana) => {
  pestana.addEventListener("click", () => activarPestana(pestana.dataset.panel));
  pestana.addEventListener("keydown", (evento) => {
    if (evento.key !== "ArrowLeft" && evento.key !== "ArrowRight") {
      return;
    }
    const pestanas = [...document.querySelectorAll(".navegacion-pestanas [role='tab']")];
    const direccion = evento.key === "ArrowRight" ? 1 : -1;
    const siguienteIndice = (pestanas.indexOf(pestana) + direccion + pestanas.length) % pestanas.length;
    pestanas[siguienteIndice].focus();
    pestanas[siguienteIndice].click();
  });
});

const estadoBiblioteca = document.getElementById("estado-biblioteca");
const listaLibros = document.getElementById("lista-libros");
const lectorLibro = document.getElementById("lector-libro");
const contenidoTexto = document.getElementById("contenido-texto");
const visorEPUB = document.getElementById("visor-epub");
const visorPDF = document.getElementById("visor-pdf");
const ayudaLector = document.getElementById("ayuda-lector");
const controlesTipografia = document.getElementById("controles-tipografia");
const tituloCapitulo = document.getElementById("titulo-capitulo");
const buscadorLibros = document.getElementById("busqueda-libros");
const controlInterlineado = document.getElementById("interlineado-libro");
const valorInterlineado = document.getElementById("valor-interlineado");
const tamanoMinimo = 14;
const tamanoMaximo = 30;
let promesaCargaEPUB = null;
let catalogoLibros = [];
let tamanoInterlineado = Number(controlInterlineado.value);
const portadaIlustrada = "libros/portadas/portada-literaria.svg";

function normalizarTexto(texto) {
  return texto.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLocaleLowerCase("es");
}

function aplicarFiltroBiblioteca() {
  const consulta = normalizarTexto(buscadorLibros.value.trim());
  const librosVisibles = catalogoLibros.filter((libro) =>
    normalizarTexto(`${libro.titulo} ${libro.autor}`).includes(consulta)
  );

  listaLibros.replaceChildren();
  librosVisibles.forEach(mostrarLibroEnCatalogo);
  if (librosVisibles.length) {
    estadoBiblioteca.textContent = consulta
      ? `${librosVisibles.length} resultado${librosVisibles.length === 1 ? "" : "s"} para «${buscadorLibros.value.trim()}».`
      : `Hay ${catalogoLibros.length} libro${catalogoLibros.length === 1 ? "" : "s"} disponible${catalogoLibros.length === 1 ? "" : "s"}.`;
  } else if (catalogoLibros.length) {
    estadoBiblioteca.textContent = `No encontramos libros para «${buscadorLibros.value.trim()}». Probá con otro título o autor.`;
  } else {
    estadoBiblioteca.textContent = "Tu próximo libro favorito puede estar acá. Guardá un archivo PDF, EPUB o TXT en la carpeta libros y registralo en libros/catalogo.json para empezar.";
  }
}

function cargarLectorEPUB() {
  if (typeof window.ePub === "function") {
    return Promise.resolve();
  }
  if (promesaCargaEPUB) {
    return promesaCargaEPUB;
  }

  promesaCargaEPUB = new Promise((resolve, reject) => {
    const script = document.createElement("script");
    const temporizador = window.setTimeout(() => {
      script.remove();
      reject(new Error("Se agotó el tiempo de espera al cargar epub.js."));
    }, 15000);
    script.src = "https://cdn.jsdelivr.net/npm/epubjs/dist/epub.min.js";
    script.async = true;
    script.onload = () => {
      window.clearTimeout(temporizador);
      if (typeof window.ePub === "function") {
        resolve();
      } else {
        reject(new Error("La librería EPUB no se inicializó correctamente."));
      }
    };
    script.onerror = () => {
      window.clearTimeout(temporizador);
      reject(new Error("No se pudo descargar epub.js."));
    };
    document.head.append(script);
  }).catch((error) => {
    promesaCargaEPUB = null;
    throw error;
  });

  return promesaCargaEPUB;
}

function actualizarTamanoLetra() {
  contenidoTexto.style.fontSize = `${tamanoLetra}px`;
  contenidoTexto.style.lineHeight = String(tamanoInterlineado);
  if (renditionEPUBActual) {
    renditionEPUBActual.themes.fontSize(`${tamanoLetra}px`);
  }
}

function actualizarInterlineado() {
  tamanoInterlineado = Number(controlInterlineado.value);
  valorInterlineado.value = tamanoInterlineado.toFixed(1).replace(".", ",");
  contenidoTexto.style.lineHeight = String(tamanoInterlineado);
  if (renditionEPUBActual) {
    actualizarTemaEPUB();
  }
}

function limpiarVisorActual() {
  visorPDF.removeAttribute("src");
  contenidoTexto.hidden = true;
  tituloCapitulo.hidden = true;
  tituloCapitulo.textContent = "";
  visorEPUB.hidden = true;
  visorPDF.hidden = true;
  visorEPUB.replaceChildren();
  if (libroEPUBActual) {
    libroEPUBActual.destroy();
    libroEPUBActual = null;
    renditionEPUBActual = null;
  }
}

function mostrarLibroEnCatalogo(libro) {
  const tarjeta = document.createElement("article");
  tarjeta.className = "tarjeta-libro";

  const portada = document.createElement("img");
  portada.className = "portada-libro";
  portada.src = libro.portada
    ? rutaLibro(libro.portada)
    : portadaIlustrada;
  portada.alt = libro.portada
    ? `Portada de ${libro.titulo}`
    : `Ilustración literaria para ${libro.titulo}`;
  portada.loading = "lazy";
  portada.addEventListener("error", () => {
    portada.src = portadaIlustrada;
    portada.alt = `Ilustración literaria para ${libro.titulo}`;
  }, { once: true });

  const contenido = document.createElement("div");
  contenido.className = "contenido-tarjeta-libro";
  const titulo = document.createElement("h3");
  titulo.textContent = libro.titulo;
  const autor = document.createElement("p");
  autor.className = "autor-tarjeta-libro";
  autor.textContent = libro.autor === "No especificado" ? "" : `Por ${libro.autor}`;
  autor.hidden = !autor.textContent;
  const descripcion = document.createElement("p");
  descripcion.className = "descripcion-tarjeta-libro";
  descripcion.textContent = libro.descripcion || "Sin descripción disponible.";
  const formato = document.createElement("p");
  formato.className = "formato-libro";
  formato.textContent = libro.archivo.split(".").pop().toUpperCase();
  const botonLeer = document.createElement("button");
  botonLeer.className = "boton boton-principal";
  botonLeer.type = "button";
  botonLeer.textContent = "Leer libro";
  botonLeer.addEventListener("click", () => abrirLibro(libro));

  contenido.append(titulo, autor, descripcion, formato, botonLeer);
  tarjeta.append(portada, contenido);
  listaLibros.append(tarjeta);
}

function validarCatalogo(catalogo) {
  if (!Array.isArray(catalogo)) {
    throw new Error("El catálogo debe ser una lista de libros.");
  }

  return catalogo.map((libro, indice) => {
    if (
      !libro ||
      typeof libro.titulo !== "string" ||
      !libro.titulo.trim() ||
      typeof libro.autor !== "string" ||
      !libro.autor.trim() ||
      typeof libro.archivo !== "string" ||
      !/^[^/\\]+\.(pdf|epub|txt)$/i.test(libro.archivo) ||
      (libro.descripcion !== undefined && typeof libro.descripcion !== "string") ||
      (libro.portada !== undefined &&
        (typeof libro.portada !== "string" ||
          !/^(?:portadas[\\/])?[^/\\]+\.(png|jpe?g|webp|gif|svg)$/i.test(libro.portada)))
    ) {
      throw new Error(`La entrada ${indice + 1} del catálogo no es válida.`);
    }
    return {
      titulo: libro.titulo.trim(),
      autor: libro.autor.trim(),
      archivo: libro.archivo,
      descripcion: libro.descripcion?.trim() || "",
      portada: libro.portada || ""
    };
  });
}

function rutaLibro(archivo) {
  return `libros/${archivo.split(/[\\/]/).map(encodeURIComponent).join("/")}`;
}

async function cargarBiblioteca() {
  try {
    const respuesta = await fetch("libros/catalogo.json");
    if (!respuesta.ok) {
      throw new Error(`No se pudo leer el catálogo (HTTP ${respuesta.status}).`);
    }
    const catalogo = validarCatalogo(await respuesta.json());
    catalogoLibros = catalogo;
    aplicarFiltroBiblioteca();
  } catch (error) {
    estadoBiblioteca.textContent = `No se pudo cargar la biblioteca: ${error.message} Comprobá que el proyecto esté abierto desde un servidor local y que libros/catalogo.json sea válido.`;
  }
}

buscadorLibros.addEventListener("input", aplicarFiltroBiblioteca);

async function abrirLibro(libro) {
  limpiarVisorActual();
  listaLibros.hidden = true;
  estadoBiblioteca.hidden = true;
  lectorLibro.hidden = false;
  document.getElementById("titulo-libro").textContent = libro.titulo;
  const autorLibro = document.getElementById("autor-libro");
  autorLibro.textContent = libro.autor === "No especificado" ? "" : `Por ${libro.autor}`;
  autorLibro.hidden = !autorLibro.textContent;
  tamanoLetra = 18;
  controlInterlineado.value = "1.8";
  actualizarInterlineado();
  actualizarTamanoLetra();
  const urlArchivo = rutaLibro(libro.archivo);
  const extension = libro.archivo.split(".").pop().toLowerCase();

  if (extension === "pdf") {
    controlesTipografia.hidden = true;
    ayudaLector.textContent = "Usá los controles de zoom del visor PDF para ajustar la lectura.";
    visorPDF.title = `Visor del libro: ${libro.titulo}`;
    visorPDF.src = urlArchivo;
    visorPDF.hidden = false;
  } else if (extension === "txt") {
    controlesTipografia.hidden = false;
    ayudaLector.textContent = "";
    try {
      const respuesta = await fetch(urlArchivo);
      if (!respuesta.ok) {
        throw new Error(`No se pudo abrir el archivo (HTTP ${respuesta.status}).`);
      }
      mostrarContenidoTXT((await respuesta.text()).replace(/^\uFEFF/, ""), libro.titulo);
      contenidoTexto.hidden = false;
    } catch (error) {
      ayudaLector.textContent = `No se pudo abrir el libro: ${error.message}`;
    }
  } else {
    controlesTipografia.hidden = false;
    ayudaLector.textContent = "";
    visorEPUB.hidden = false;
    try {
      await cargarLectorEPUB();
      libroEPUBActual = window.ePub(urlArchivo);
      renditionEPUBActual = libroEPUBActual.renderTo(visorEPUB, {
        width: "100%",
        height: "100%",
        spread: "none"
      });
      actualizarTemaEPUB();
      await renditionEPUBActual.display();
    } catch (error) {
      limpiarVisorActual();
      ayudaLector.textContent = `No se pudo abrir el EPUB: ${error.message} Revisá la conexión a internet y la validez del archivo.`;
    }
  }

  lectorLibro.scrollIntoView({ behavior: "smooth", block: "start" });
}

function mostrarContenidoTXT(texto, tituloLibro) {
  const lineas = texto.split(/\r?\n/);
  const primeraLinea = lineas.findIndex((linea) => linea.trim());
  if (primeraLinea !== -1 && normalizarTexto(lineas[primeraLinea].trim()) === normalizarTexto(tituloLibro)) {
    lineas.splice(primeraLinea, 1);
  }

  contenidoTexto.replaceChildren();
  let parrafoActual = [];
  let primerCapitulo = true;

  function agregarParrafo() {
    const textoParrafo = parrafoActual.join(" ").trim();
    if (textoParrafo) {
      const parrafo = document.createElement("p");
      parrafo.textContent = textoParrafo;
      contenidoTexto.append(parrafo);
    }
    parrafoActual = [];
  }

  lineas.forEach((linea) => {
    const textoLinea = linea.trim();
    if (/^cap[ií]tulo\b/i.test(textoLinea)) {
      agregarParrafo();
      if (primerCapitulo) {
        tituloCapitulo.textContent = textoLinea;
        tituloCapitulo.hidden = false;
        primerCapitulo = false;
      } else {
        const encabezado = document.createElement("h4");
        encabezado.className = "titulo-capitulo-adicional";
        encabezado.textContent = textoLinea;
        contenidoTexto.append(encabezado);
      }
    } else if (!textoLinea) {
      agregarParrafo();
    } else {
      parrafoActual.push(textoLinea);
    }
  });
  agregarParrafo();
}

document.getElementById("btn-volver-biblioteca").addEventListener("click", () => {
  limpiarVisorActual();
  lectorLibro.hidden = true;
  listaLibros.hidden = false;
  estadoBiblioteca.hidden = false;
  controlesTipografia.hidden = false;
  activarPestana("biblioteca");
  document.getElementById("titulo-biblioteca").scrollIntoView({ behavior: "smooth", block: "start" });
});

document.getElementById("btn-aumentar-letra").addEventListener("click", () => {
  tamanoLetra = Math.min(tamanoLetra + 2, tamanoMaximo);
  actualizarTamanoLetra();
});

document.getElementById("btn-disminuir-letra").addEventListener("click", () => {
  tamanoLetra = Math.max(tamanoLetra - 2, tamanoMinimo);
  actualizarTamanoLetra();
});

controlInterlineado.addEventListener("input", actualizarInterlineado);

void cargarBiblioteca();

document.querySelector(".marca").addEventListener("click", (evento) => {
  evento.preventDefault();
  activarPestana("citas");
  window.scrollTo(0, 0);
});

const destinoInicial = window.location.hash.slice(1);
if (["menu-cafes", "menu-del-dia", "especial"].includes(destinoInicial)) {
  activarPestana("panel-menu");
} else if (["salon", "tu-mesa"].includes(destinoInicial)) {
  activarPestana("salon");
} else if (destinoInicial === "biblioteca") {
  activarPestana("biblioteca");
}
if (destinoInicial && document.getElementById(destinoInicial)) {
  document.getElementById(destinoInicial).scrollIntoView({ block: "start" });
}

document.getElementById("btn-ver-pedido").addEventListener("click", () => {
  activarPestana("salon");
  document.getElementById("tu-mesa").scrollIntoView({ behavior: "smooth", block: "start" });
});

document.getElementById("btn-compartir").addEventListener("click", async () => {
  const estado = document.getElementById("estado-frase");

  try {
    if (navigator.share) {
      await navigator.share({
        title: document.title,
        text: "Café & Letras: donde el aroma del café se combina con la magia de la lectura.",
        url: window.location.href
      });
      estado.textContent = "Gracias por compartir Café & Letras.";
      notificar("Gracias por compartir Café & Letras.");
      return;
    }
  } catch (error) {
    estado.textContent = "No se pudieron abrir las opciones para compartir. Podés copiar el enlace.";
  }

  document.getElementById("enlace-compartir").value = window.location.href;
  document.getElementById("estado-compartir").textContent =
    "Elegí “Copiar enlace” o seleccioná el enlace para copiarlo manualmente.";
  document.getElementById("dialogo-compartir").showModal();
});

document.getElementById("btn-copiar-enlace").addEventListener("click", async () => {
  const enlace = document.getElementById("enlace-compartir");
  const estado = document.getElementById("estado-compartir");

  try {
    await copiarTexto(enlace.value);
    estado.textContent = "Enlace copiado al portapapeles.";
  } catch (error) {
    enlace.focus();
    enlace.select();
    estado.textContent = "No se pudo copiar automáticamente. El enlace quedó seleccionado para copiarlo manualmente.";
  }
});

// Los precios se editan en pesos argentinos como números enteros.
const productosMenu = [
  {
    id: "espresso-cervantes",
    nombre: "Espresso Cervantes",
    descripcion: "Café intenso y concentrado, recién molido y preparado a presión.",
    categoria: "Cafés",
    precio: 3200,
    imagen: "https://images.unsplash.com/photo-1510707577719-ae7c14805e3a?auto=format&fit=crop&w=720&q=80",
    textoAlternativo: "Taza pequeña de espresso"
  },
  {
    id: "americano",
    nombre: "Café americano",
    descripcion: "Espresso alargado con agua caliente.",
    categoria: "Cafés",
    precio: 3500,
    imagen: "https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=720&q=80",
    textoAlternativo: "Taza de café americano"
  },
  {
    id: "cortado",
    nombre: "Café cortado",
    descripcion: "Espresso con un toque de leche caliente.",
    categoria: "Cafés",
    precio: 3300,
    imagen: "https://images.unsplash.com/photo-1510707577719-ae7c14805e3a?auto=format&fit=crop&w=720&q=80",
    textoAlternativo: "Café corto servido en una taza"
  },
  {
    id: "cafe-con-leche",
    nombre: "Café con leche",
    descripcion: "Café suave mezclado con leche caliente.",
    categoria: "Cafés",
    precio: 3900,
    imagen: "https://images.unsplash.com/photo-1461023058943-07fcbe16d735?auto=format&fit=crop&w=720&q=80",
    textoAlternativo: "Café con leche servido en una taza"
  },
  {
    id: "cappuccino-vainilla",
    nombre: "Cappuccino Vainilla & Canela",
    descripcion: "Espresso, leche espumada, vainilla y una pizca de canela.",
    categoria: "Cafés",
    precio: 4800,
    imagen: "https://images.unsplash.com/photo-1570968915860-54d5c301fa9f?auto=format&fit=crop&w=720&q=80",
    textoAlternativo: "Cappuccino con espuma de leche"
  },
  {
    id: "latte",
    nombre: "Café latte",
    descripcion: "Espresso suave con abundante leche vaporizada.",
    categoria: "Cafés",
    precio: 4500,
    imagen: "https://images.unsplash.com/photo-1461023058943-07fcbe16d735?auto=format&fit=crop&w=720&q=80",
    textoAlternativo: "Café latte servido en una taza"
  },
  {
    id: "mocaccino",
    nombre: "Mocaccino",
    descripcion: "Espresso, leche vaporizada y un toque de chocolate.",
    categoria: "Cafés",
    precio: 4900,
    imagen: "https://images.unsplash.com/photo-1572490122747-3968b75cc699?auto=format&fit=crop&w=720&q=80",
    textoAlternativo: "Café con leche y chocolate"
  },
  {
    id: "cafe-doble",
    nombre: "Café doble",
    descripcion: "Dos medidas de espresso para un sabor más intenso.",
    categoria: "Cafés",
    precio: 4300,
    imagen: "https://images.unsplash.com/photo-1510707577719-ae7c14805e3a?auto=format&fit=crop&w=720&q=80",
    textoAlternativo: "Taza de café espresso"
  },
  {
    id: "cold-brew",
    nombre: "Cold Brew Borrador",
    descripcion: "Café infusionado en frío, servido con hielo; suave y refrescante.",
    categoria: "Cafés",
    precio: 4700,
    imagen: "https://images.unsplash.com/photo-1461023058943-07fcbe16d735?auto=format&fit=crop&w=720&q=80",
    textoAlternativo: "Café frío servido en un vaso"
  },
  {
    id: "dulce-de-leche",
    nombre: "Café con dulce de leche",
    descripcion: "Café con leche cremosa y una cucharada de dulce de leche.",
    categoria: "Cafés",
    precio: 5000,
    imagen: "https://images.unsplash.com/photo-1572490122747-3968b75cc699?auto=format&fit=crop&w=720&q=80",
    textoAlternativo: "Café cremoso con dulce de leche"
  },
  {
    id: "croissant",
    nombre: "Croissant de manteca",
    descripcion: "Hojaldre dorado y tierno, horneado cada mañana.",
    categoria: "Repostería",
    precio: 2800,
    imagen: "https://images.unsplash.com/photo-1555507036-ab1f4038808a?auto=format&fit=crop&w=720&q=80",
    textoAlternativo: "Croissant recién horneado"
  },
  {
    id: "brownie",
    nombre: "Brownie con nueces",
    descripcion: "Brownie húmedo de chocolate con nueces tostadas.",
    categoria: "Repostería",
    precio: 4300,
    imagen: "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&w=720&q=80",
    textoAlternativo: "Porción de brownie de chocolate"
  },
  {
    id: "medialunas",
    nombre: "Medialunas",
    descripcion: "Clásicas medialunas de manteca, horneadas cada mañana.",
    categoria: "Repostería",
    precio: 2400,
    imagen: "https://images.unsplash.com/photo-1555507036-ab1f4038808a?auto=format&fit=crop&w=720&q=80",
    textoAlternativo: "Medialunas recién horneadas"
  },
  {
    id: "torta-del-dia",
    nombre: "Porción de torta del día",
    descripcion: "Una porción casera que cambia con la inspiración de la cocina.",
    categoria: "Repostería",
    precio: 5200,
    imagen: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=720&q=80",
    textoAlternativo: "Porción de torta casera"
  },
  {
    id: "tarta-limon",
    nombre: "Tarta de limón",
    descripcion: "Masa suave, crema de limón y merengue dorado.",
    categoria: "Repostería",
    precio: 4600,
    imagen: "https://images.unsplash.com/photo-1519915028121-7d3463d20b13?auto=format&fit=crop&w=720&q=80",
    textoAlternativo: "Porción de tarta de limón"
  },
  {
    id: "maridaje-poesia",
    nombre: "Poesía y medialunas",
    descripcion: "Café con leche y medialunas, con una selección de poemas para leer sin apuro.",
    categoria: "Maridajes Literarios",
    precio: 6200,
    imagen: "https://images.unsplash.com/photo-1555507036-ab1f4038808a?auto=format&fit=crop&w=720&q=80",
    textoAlternativo: "Medialunas y una taza de café"
  },
  {
    id: "maridaje-novela",
    nombre: "Un capítulo más",
    descripcion: "Cappuccino y brownie con nueces, para acompañar una novela larga.",
    categoria: "Maridajes Literarios",
    precio: 7500,
    imagen: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=720&q=80",
    textoAlternativo: "Porción de torta junto a una bebida caliente"
  },
  {
    id: "maridaje-ensayo",
    nombre: "Lectura en voz baja",
    descripcion: "Espresso doble y torta del día, con un ensayo breve para abrir la conversación.",
    categoria: "Maridajes Literarios",
    precio: 7900,
    imagen: "https://images.unsplash.com/photo-1510707577719-ae7c14805e3a?auto=format&fit=crop&w=720&q=80",
    textoAlternativo: "Café espresso junto a una porción de torta"
  }
];

const especialDelDia = {
  id: "especial-capitulos-chocolate",
  nombre: "Capítulos de chocolate",
  descripcion: "Cappuccino cremoso acompañado por una porción de brownie casero.",
  categoria: "Maridajes Literarios",
  precio: 7500,
  imagen: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=900&q=80",
  textoAlternativo: "Torta de chocolate junto a una taza de café"
};

const productosMenuDelDia = [
  {
    id: "menu-tostado",
    nombre: "Tostado de la casa",
    descripcion: "Pan de campo, queso fundido y tomate fresco, con hojas verdes.",
    categoria: "Menú del Día",
    precio: 7200,
    imagen: "https://images.unsplash.com/photo-1528735602780-2552fd46c7af?auto=format&fit=crop&w=720&q=80",
    textoAlternativo: "Tostado de pan servido en un plato"
  },
  {
    id: "menu-croissant",
    nombre: "Merienda entre páginas",
    descripcion: "Café con leche y dos medialunas de manteca recién horneadas.",
    categoria: "Menú del Día",
    precio: 6500,
    imagen: "https://images.unsplash.com/photo-1555507036-ab1f4038808a?auto=format&fit=crop&w=720&q=80",
    textoAlternativo: "Medialunas recién horneadas"
  },
  {
    id: "menu-tarta",
    nombre: "Pausa de limón",
    descripcion: "Porción de tarta de limón con una infusión a elección.",
    categoria: "Menú del Día",
    precio: 6800,
    imagen: "https://images.unsplash.com/photo-1519915028121-7d3463d20b13?auto=format&fit=crop&w=720&q=80",
    textoAlternativo: "Porción de tarta de limón"
  }
];

document.getElementById("nombre-especial").textContent = especialDelDia.nombre;
document.getElementById("descripcion-especial").textContent =
  `${especialDelDia.descripcion} El compañero ideal para un buen capítulo.`;
document.getElementById("precio-especial").textContent = formatoPesos(especialDelDia.precio);

const listaMenu = document.getElementById("lista-menu");
const estadoMenu = document.getElementById("estado-menu");
const clavePedidos = "cafeLetrasPedidos";
const claveMesa = "cafeLetrasMesa";
const pedidosPorMesa = {};
let mesaSeleccionada = 4;
let filtroActual = "Todos";

try {
  const pedidosGuardados = JSON.parse(localStorage.getItem(clavePedidos) || "{}");
  if (pedidosGuardados && typeof pedidosGuardados === "object" && !Array.isArray(pedidosGuardados)) {
    Object.assign(pedidosPorMesa, pedidosGuardados);
  }
} catch (error) {
  notificar("No se pudieron recuperar los pedidos guardados.");
}

try {
  const mesaGuardada = Number(sessionStorage.getItem(claveMesa));
  if (Number.isInteger(mesaGuardada) && mesaGuardada >= 1 && mesaGuardada <= 6) {
    mesaSeleccionada = mesaGuardada;
  }
} catch (error) {
  notificar("No se pudo recuperar la mesa seleccionada.");
}

const mesas = [
  { numero: 1, estado: "Libre", ubicacion: "Junto a la ventana", descripcion: "Con luz natural para leer por la tarde." },
  { numero: 2, estado: "Ocupada", ubicacion: "Rincón de biblioteca", descripcion: "Un refugio tranquilo entre estantes." },
  { numero: 3, estado: "Libre", ubicacion: "Salón principal", descripcion: "Amplia, ideal para compartir una lectura." },
  { numero: 4, estado: "Mi mesa", ubicacion: "Cerca de los estantes", descripcion: "Tu rincón actual para café y lectura." },
  { numero: 5, estado: "Libre", ubicacion: "Patio interior", descripcion: "Un espacio sereno y luminoso." },
  { numero: 6, estado: "Ocupada", ubicacion: "Rincón de lectura", descripcion: "Una mesa acogedora junto a la lámpara." }
];

const mesaInicial = mesas.find((mesa) => mesa.numero === mesaSeleccionada);
if (mesaInicial && mesaInicial.estado === "Ocupada") {
  mesaSeleccionada = 4;
}
mesas.forEach((mesa) => {
  if (mesa.numero === mesaSeleccionada) {
    mesa.estado = "Mi mesa";
  } else if (mesa.estado === "Mi mesa") {
    mesa.estado = "Libre";
  }
});
document.getElementById("indicador-mesa-encabezado").textContent = `Mesa ${mesaSeleccionada} (Tú)`;
document.getElementById("indicador-mesa").textContent =
  `Mesa ${String(mesaSeleccionada).padStart(2, "0")} (Tu mesa)`;

function formatoPesos(monto) {
  return `$${new Intl.NumberFormat("es-AR", { maximumFractionDigits: 0 }).format(monto)}`;
}

function guardarPedidos() {
  try {
    localStorage.setItem(clavePedidos, JSON.stringify(pedidosPorMesa));
  } catch (error) {
    notificar("No se pudo guardar el pedido en este navegador.");
  }
}

function crearTarjetaProducto(producto) {
  const tarjeta = document.createElement("article");
  tarjeta.className = "tarjeta-producto";

  const imagen = document.createElement("img");
  imagen.src = producto.imagen;
  imagen.alt = producto.textoAlternativo;
  imagen.loading = "lazy";

  const contenido = document.createElement("div");
  contenido.className = "contenido-producto";

  const categoria = document.createElement("p");
  categoria.className = "categoria-producto";
  categoria.textContent = producto.categoria;

  const etiqueta = document.createElement("span");
  etiqueta.className = "etiqueta-producto";
  etiqueta.textContent = producto.categoria === "Cafés"
    ? "Artesanal"
    : producto.categoria === "Repostería"
      ? "Del día"
      : "Maridaje";

  const nombre = document.createElement("h3");
  nombre.textContent = producto.nombre;

  const descripcion = document.createElement("p");
  descripcion.className = "descripcion-producto";
  descripcion.textContent = producto.descripcion;

  const precio = document.createElement("p");
  precio.className = "precio-producto";
  precio.textContent = formatoPesos(producto.precio);

  const botonPedir = document.createElement("button");
  botonPedir.className = "boton boton-principal boton-agregar";
  botonPedir.type = "button";
  botonPedir.textContent = "Pedir a mi mesa";
  botonPedir.addEventListener("click", () => agregarProducto(producto));

  contenido.append(categoria, etiqueta, nombre, descripcion, precio, botonPedir);
  tarjeta.append(imagen, contenido);
  return tarjeta;
}

const listaMenuDelDia = document.getElementById("lista-menu-del-dia");
listaMenuDelDia.replaceChildren(...productosMenuDelDia.map(crearTarjetaProducto));

function mostrarProductos(filtro = filtroActual) {
  filtroActual = filtro;
  const productosVisibles = filtro === "Todos"
    ? productosMenu
    : productosMenu.filter((producto) => producto.categoria === filtro);

  listaMenu.replaceChildren(...productosVisibles.map(crearTarjetaProducto));
  estadoMenu.textContent = `${productosVisibles.length} productos en ${filtro}.`;

  document.querySelectorAll(".boton-filtro").forEach((boton) => {
    const seleccionado = boton.dataset.filtro === filtro;
    boton.classList.toggle("activo", seleccionado);
    boton.setAttribute("aria-pressed", String(seleccionado));
  });
}

document.querySelectorAll(".boton-filtro").forEach((boton) => {
  boton.addEventListener("click", () => mostrarProductos(boton.dataset.filtro));
});

document.getElementById("btn-ordenar-especial").addEventListener("click", () => {
  agregarProducto(especialDelDia);
});

function obtenerPedidoActual() {
  if (!pedidosPorMesa[mesaSeleccionada]) {
    pedidosPorMesa[mesaSeleccionada] = {};
  }
  return pedidosPorMesa[mesaSeleccionada];
}

function agregarProducto(producto) {
  const pedido = obtenerPedidoActual();
  if (!pedido[producto.id]) {
    pedido[producto.id] = { producto, cantidad: 0 };
  }
  pedido[producto.id].cantidad += 1;
  dibujarPedido();
  guardarPedidos();
  document.getElementById("estado-cuenta").textContent =
    `${producto.nombre} agregado al pedido de la Mesa ${String(mesaSeleccionada).padStart(2, "0")}.`;
  notificar(`${producto.nombre} agregado al pedido.`);
}

function actualizarCantidad(idProducto, cambio) {
  const pedido = obtenerPedidoActual();
  const linea = pedido[idProducto];
  if (!linea) {
    return;
  }

  linea.cantidad += cambio;
  if (linea.cantidad <= 0) {
    delete pedido[idProducto];
  }
  dibujarPedido();
  guardarPedidos();
}

function dibujarPedido() {
  const pedido = obtenerPedidoActual();
  const cuerpoPedido = document.getElementById("productos-pedido");
  const productos = Object.values(pedido);
  cuerpoPedido.replaceChildren();
  document.getElementById("mesa-pedido-vacia").hidden = productos.length > 0;

  let subtotal = 0;
  productos.forEach(({ producto, cantidad }) => {
    const importeLinea = producto.precio * cantidad;
    subtotal += importeLinea;
    const fila = document.createElement("tr");

    const nombre = document.createElement("th");
    nombre.scope = "row";
    nombre.textContent = producto.nombre;

    const precio = document.createElement("td");
    precio.textContent = formatoPesos(producto.precio);

    const controlCantidad = document.createElement("td");
    controlCantidad.className = "control-cantidad";
    const botonMenos = document.createElement("button");
    botonMenos.className = "boton-control-cantidad";
    botonMenos.type = "button";
    botonMenos.textContent = "−";
    botonMenos.setAttribute("aria-label", `Disminuir ${producto.nombre}`);
    botonMenos.addEventListener("click", () => actualizarCantidad(producto.id, -1));
    const cantidadTexto = document.createElement("span");
    cantidadTexto.textContent = String(cantidad);
    const botonMas = document.createElement("button");
    botonMas.className = "boton-control-cantidad";
    botonMas.type = "button";
    botonMas.textContent = "+";
    botonMas.setAttribute("aria-label", `Aumentar ${producto.nombre}`);
    botonMas.addEventListener("click", () => actualizarCantidad(producto.id, 1));
    controlCantidad.append(botonMenos, cantidadTexto, botonMas);

    const importe = document.createElement("td");
    importe.textContent = formatoPesos(importeLinea);

    const acciones = document.createElement("td");
    const botonQuitar = document.createElement("button");
    botonQuitar.className = "boton-quitar";
    botonQuitar.type = "button";
    botonQuitar.textContent = "Quitar";
    botonQuitar.addEventListener("click", () => {
      delete obtenerPedidoActual()[producto.id];
      dibujarPedido();
      guardarPedidos();
      notificar(`${producto.nombre} quitado del pedido.`);
    });
    acciones.append(botonQuitar);
    fila.append(nombre, precio, controlCantidad, importe, acciones);
    cuerpoPedido.append(fila);
  });

  document.getElementById("subtotal-pedido").textContent = formatoPesos(subtotal);
  document.getElementById("total-pedido").textContent = formatoPesos(subtotal);
}

document.getElementById("btn-pedir-cuenta").addEventListener("click", () => {
  const total = document.getElementById("total-pedido").textContent;
  document.getElementById("estado-cuenta").textContent =
    `Cuenta de demostración para la Mesa ${String(mesaSeleccionada).padStart(2, "0")}: ${total}. No se procesa ningún pago.`;
  notificar(`Cuenta de demostración: ${total}. No se procesa ningún pago.`);
});

const dialogoConfirmarPedido = document.getElementById("dialogo-confirmar-pedido");

document.getElementById("btn-enviar-cocina").addEventListener("click", () => {
  const resumen = document.getElementById("resumen-para-cocina");
  const pedido = Object.values(obtenerPedidoActual());
  resumen.replaceChildren();

  if (pedido.length === 0) {
    document.getElementById("estado-cuenta").textContent =
      "Agregá al menos un producto antes de revisar el pedido.";
    return;
  }

  pedido.forEach(({ producto, cantidad }) => {
    const item = document.createElement("li");
    item.textContent = `${producto.nombre} × ${cantidad} — ${formatoPesos(producto.precio * cantidad)}`;
    resumen.append(item);
  });
  document.getElementById("total-para-cocina").textContent =
    document.getElementById("total-pedido").textContent;
  dialogoConfirmarPedido.showModal();
});

document.getElementById("btn-cancelar-pedido").addEventListener("click", () => {
  dialogoConfirmarPedido.close();
});

document.getElementById("btn-confirmar-pedido").addEventListener("click", () => {
  dialogoConfirmarPedido.close();
  document.getElementById("estado-cuenta").textContent =
    `Pedido de demostración confirmado para la Mesa ${String(mesaSeleccionada).padStart(2, "0")}. No se envió realmente a una cocina.`;
  notificar("Pedido registrado en la demostración; no se envió a una cocina real.");
});

function seleccionarMesa(numero) {
  const mesaNueva = mesas.find((mesa) => mesa.numero === numero);
  if (!mesaNueva || mesaNueva.estado === "Ocupada") {
    notificar("Esa mesa no está disponible.");
    return;
  }

  mesaSeleccionada = numero;
  const mesaActual = mesaNueva;
  mesaActual.estado = "Mi mesa";
  mesas.forEach((mesa) => {
    if (mesa.numero !== numero && mesa.estado === "Mi mesa") {
      mesa.estado = "Libre";
    }
  });

  const numeroConCeros = String(numero).padStart(2, "0");
  document.getElementById("indicador-mesa-encabezado").textContent = `Mesa ${numero} (Tú)`;
  document.getElementById("indicador-mesa").textContent = `Mesa ${numeroConCeros} (Tu mesa)`;
  document.querySelectorAll(".numero-mesa-enlace").forEach((elemento) => {
    elemento.textContent = numeroConCeros;
  });
  dibujarMesas();
  dibujarPedido();
  document.getElementById("estado-cuenta").textContent =
    `Ahora estás viendo el pedido local de la Mesa ${numeroConCeros}.`;
  try {
    sessionStorage.setItem(claveMesa, String(numero));
  } catch (error) {
    notificar("No se pudo guardar la mesa seleccionada durante esta sesión.");
  }
  notificar(`Mesa ${numeroConCeros} seleccionada.`);
}

function dibujarMesas() {
  const listaMesas = document.getElementById("lista-mesas");
  listaMesas.replaceChildren();
  mesas.forEach((mesa) => {
    const tarjeta = document.createElement("article");
    tarjeta.className = "tarjeta-mesa";
    tarjeta.classList.toggle("mesa-seleccionada", mesa.numero === mesaSeleccionada);
    tarjeta.classList.toggle("mesa-ocupada", mesa.estado === "Ocupada");

    const titulo = document.createElement("h3");
    titulo.textContent = `Mesa ${String(mesa.numero).padStart(2, "0")}`;
    const estado = document.createElement("p");
    estado.className = "estado-mesa";
    estado.textContent = mesa.estado;
    const descripcion = document.createElement("p");
    descripcion.textContent = mesa.descripcion;
    const ubicacion = document.createElement("p");
    ubicacion.className = "ubicacion-mesa";
    ubicacion.textContent = mesa.ubicacion;
    tarjeta.append(titulo, estado, ubicacion, descripcion);

    if (mesa.estado === "Libre" || mesa.estado === "Mi mesa") {
      const boton = document.createElement("button");
      boton.className = mesa.numero === mesaSeleccionada
        ? "boton boton-secundario"
        : "boton boton-principal";
      boton.type = "button";
      boton.textContent = mesa.numero === mesaSeleccionada ? "Mesa seleccionada" : "Elegir esta mesa";
      boton.disabled = mesa.numero === mesaSeleccionada;
      boton.addEventListener("click", () => seleccionarMesa(mesa.numero));
      tarjeta.append(boton);
    } else {
      const aviso = document.createElement("p");
      aviso.className = "aviso-ocupada";
      aviso.textContent = "No disponible";
      tarjeta.append(aviso);
    }
    listaMesas.append(tarjeta);
  });
}

document.getElementById("formulario-mesero").addEventListener("submit", (evento) => {
  evento.preventDefault();
  const datos = new FormData(evento.currentTarget);
  const tipoSolicitud = datos.get("solicitud").toString();
  const nota = datos.get("nota").toString().trim();
  const detalleNota = nota ? ` Nota: ${nota}` : "";
  document.getElementById("confirmacion-mesero").textContent =
    `Solicitud de “${tipoSolicitud}” registrada para la Mesa ${String(mesaSeleccionada).padStart(2, "0")}.${detalleNota} Esta demostración no avisa a un mesero real.`;
  notificar(`Solicitud “${tipoSolicitud}” registrada en la demostración.`);
  dialogoMesero.close();
  evento.currentTarget.reset();
});

const formularioReserva = document.getElementById("formulario-reserva");
const botonMostrarReserva = document.getElementById("btn-mostrar-reserva");
botonMostrarReserva.addEventListener("click", () => {
  formularioReserva.hidden = !formularioReserva.hidden;
  botonMostrarReserva.setAttribute("aria-expanded", String(!formularioReserva.hidden));
  if (!formularioReserva.hidden) {
    formularioReserva.elements.namedItem("nombre").focus();
  }
});

const campoFechaReserva = formularioReserva.elements.namedItem("fecha");
const fechaLocal = new Date();
campoFechaReserva.min = new Date(fechaLocal.getTime() - fechaLocal.getTimezoneOffset() * 60000)
  .toISOString()
  .slice(0, 10);

formularioReserva.addEventListener("submit", (evento) => {
  evento.preventDefault();
  const datos = new FormData(formularioReserva);
  const nombre = datos.get("nombre").toString().trim();
  const [anio, mes, dia] = datos.get("fecha").toString().split("-");
  document.getElementById("confirmacion-reserva").textContent =
    `Solicitud recibida para ${nombre}, el ${dia}/${mes}/${anio} a las ${datos.get("hora")}, para ${datos.get("personas")} personas. No es una reserva confirmada.`;
});

mostrarProductos();
dibujarMesas();
dibujarPedido();
