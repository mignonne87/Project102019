const Sequelize = require('sequelize');

module.exports = (sequelize) => {
  class Course extends Sequelize.Model {}
  Course.init({
    // Course attributes
    id: {
      type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    title: {
      type: Sequelize.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'Plase provide a value for course title',
        },
        notEmpty: {
          msg: 'Plase provide a value for course title',
        },
      }
    },
    description: {
      type: Sequelize.TEXT,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'Plase provide a value for course description',
        },
        notEmpty: {
          msg: 'Plase provide a value for course description',
        },
      }
    },
    estimatedTime: {
      type: Sequelize.STRING,
      allowNull: true
    },
    materialsNeeded: {
      type: Sequelize.STRING,
      allowNull: true
    }
  }, {
    sequelize
  });
  Course.associate = (models) => {
    Course.belongsTo(models.User,{ 
      foreignKey: {
        fieldName: 'userId',
        field: 'userId',
        allowNull: false,
      },
      onDelete: 'cascade',
     });

  }

return Course;
}