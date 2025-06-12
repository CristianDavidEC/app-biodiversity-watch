import renderer from 'react-test-renderer';
import CardObservation from '../observations/CardObservation';

const baseProps = {
    image: '',
    description: 'Descripción de prueba',
    date: '2024-06-01',
    id: '1',
    location: 'Ubicación de prueba',
};

describe('CardObservation', () => {
    it('renderiza correctamente con props mínimas', () => {
        const tree = renderer.create(<CardObservation {...baseProps} />).toJSON();
        expect(tree).toMatchSnapshot();
    });

    it('renderiza correctamente con nombres de especie', () => {
        const tree = renderer.create(
            <CardObservation
                {...baseProps}
                specie_common_name="Nombre común"
                specie_scientific_name="Nombre científico"
            />
        ).toJSON();
        expect(tree).toMatchSnapshot();
    });
}); 