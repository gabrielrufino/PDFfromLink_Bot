export class RequestRepository {
  /**
   *
   * @param {Object} params
   * @param {import('mongodb').Db} params.database
   */
  constructor ({
    database
  }) {
    this.collection = database.collection('requests')
  }

  /**
   *
   * @param {Object} params
   * @param {import('grammy').CommandContext<import('grammy').Context>} params.context
   */
  async create ({
    context
  }) {
    return this.collection.insertOne({
      context,
      createdAt: new Date().toISOString()
    })
  }
}
