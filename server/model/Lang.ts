export const LangModel = (sequelize: any, DataTypes: any) => {
    const Lang = sequelize.define(
        'Lang',
        {
            idx: {
                type: DataTypes.STRING(30),
            },
            learningLang: {
                primaryKey: true,
                type: DataTypes.STRING(30),
            },
            userid: {
                type: DataTypes.STRING(30),
                allowNull: false,
            },
        },
        {
            freezeTableName: true,
        }
    );
    return Lang;
};
