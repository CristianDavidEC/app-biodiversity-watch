import renderer from 'react-test-renderer';
import DetailsObservation from '../observations/DetailsObservation';

describe('DetailsObservation', () => {
    it('renderiza correctamente con props mínimas', () => {
        const tree = renderer.create(
            <DetailsObservation observation={{}} />
        ).toJSON();
        expect(tree).toMatchSnapshot();
    });

    it('renderiza correctamente con todos los campos', () => {
        const tree = renderer.create(
            <DetailsObservation observation={{
                specie_common_name: 'Jaguar',
                specie_scientific_name: 'Panthera onca',
                similarity_percentage: 95.5,
                date: '2024-06-01',
                created_at: '2024-06-01T12:00:00Z',
                latitude: 10.123,
                longitude: -84.123,
                note: 'Observación de prueba',
                id_specie: '123',
                type_observation: 'Visual',
                state: 'Confirmada',
            }} />
        ).toJSON();
        expect(tree).toMatchSnapshot();
    });
}); 