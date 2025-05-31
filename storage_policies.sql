-- Crear el bucket como privado si no existe
INSERT INTO storage.buckets (id, name, public)
VALUES ('biodiversity-files', 'biodiversity-files', false)
ON CONFLICT (id) DO NOTHING;

-- Asegúrate de que el bucket sea privado
UPDATE storage.buckets SET public = false WHERE id = 'biodiversity-files';

-- Política para permitir a los usuarios autenticados subir archivos
CREATE POLICY "Usuarios autenticados pueden subir archivos"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'biodiversity-files');

-- Política para permitir a los usuarios autenticados ver archivos
CREATE POLICY "Usuarios autenticados pueden ver archivos"
ON storage.objects FOR SELECT
TO authenticated
USING (bucket_id = 'biodiversity-files');

-- Política para permitir a los usuarios autenticados actualizar sus propios archivos
CREATE POLICY "Usuarios autenticados pueden actualizar sus archivos"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'biodiversity-files')
WITH CHECK (bucket_id = 'biodiversity-files');

-- Política para permitir a los usuarios autenticados eliminar sus propios archivos
CREATE POLICY "Usuarios autenticados pueden eliminar sus archivos"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'biodiversity-files');