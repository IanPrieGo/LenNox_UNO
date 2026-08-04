# LenNox_UNO
Ejercicio de Compilacion para entender mejor el funcionamiento de Compiladores e Interpretadores

El compilador esta escrito en JavaScript, y utiliza Node para funcionar. El compilador trabaja con un lenguaje original propio llamado LennoxUNO, el cual cuenta con una sintaxis completamente en español (a excepcion de algunas cosas que no era tan practico pasarlo a español completamente).

El emisor de codigo del compilador no trabaja directamente con los tokens, sino que crea objetos de la clase Comando, los cuales ahora mismo solo cuentan con metodos para ser transpilados a Java, pero la idea de usuar la case Comando esque se pueda transpilar a otros lenguajes.
