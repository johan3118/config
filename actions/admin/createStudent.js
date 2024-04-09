'use server'
const prisma = require('@/api/api.js')

const getNextUserId = async () => {
  const maxUserId = await prisma.estudiante.findFirst({
    select: {
      est_id: true
    },
    orderBy: {
      est_id: 'desc'
    }
  });

  if (maxUserId) {
    return maxUserId.est_id + 1;
  } else {
    return 1000000;
  }
};

export async function addStudent(data) {
  const nextStudent = await getNextUserId()

  const est_id = nextStudent
  const nombres = data.get("NOMBRES")
  const apellidos = data.get("APELLIDOS")
  const fecha_nac = data.get("NAC.")
  const correo = data.get("CORREO")
  const contrasena = data.get("CONTRASENA")
  const conf_contrasena = data.get("CONF. CONTRASENA");
  const carrera_id = parseInt(data.get("CARRERA ID"));
  const deshabilitado = false
  const indice = 4
  const programa_id = parseInt(data.get("PROGRAMA ID"));
  const creditos_aprobados = 0

  if (contrasena !== conf_contrasena) {
    return { status: 'error', message: 'Las claves no son iguales' };
  }

  const carrera = await prisma.carrera.findUnique({
    where: { carrera_id },
  });

  const programa = await prisma.programa.findUnique({
    where: { programa_id },
  });

  if (!carrera) {
    return { status: 'error', message: 'Carrera ID no existe' };
  }

  if (!programa) {
    return { status: 'error', message: 'Programa ID no existe' };
  }

  const newStudent = await prisma.estudiante.create({
    data: {
      est_id: est_id,
      nombres: nombres,
      apellidos: apellidos,
      fecha_nac: new Date(fecha_nac),
      correo: correo,
      contrasena: contrasena,
      carrera_id: carrera_id,
      deshabilitado: deshabilitado,
      indice: indice,
      programa_id: programa_id,
      creditos_aprobados: creditos_aprobados
    },
  });
  return { status: 'success', message: 'Estudiante creado exitosamente', data: newStudent };
}
